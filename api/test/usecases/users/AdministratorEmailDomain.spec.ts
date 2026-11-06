import { UniversityFactory } from '@app/common';
import { KeycloakClient } from '@app/keycloak';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { University } from 'src/core/models';
import { CreateAdministratorUsecase } from 'src/core/usecases/user/create-administrator.usecase';
import { UpdateAdministratorUsecase } from 'src/core/usecases/user/update-administrator.usecase';
import { InMemoryUniversityRepository } from 'src/providers/persistance/repositories/in-memory-university-repository';

describe('Administrator email domain', () => {
  // The repositories return University instances, the factory plain objects.
  const universityFactory = new UniversityFactory();
  const centralUniversity = new University(
    universityFactory.makeOne({ domains: ['@univ-lorraine.fr'] }),
  );
  const partnerUniversity = new University(
    universityFactory.makeOne({ parent: centralUniversity.id, domains: [] }),
  );
  const universityRepository = new InMemoryUniversityRepository();
  universityRepository.init([centralUniversity, partnerUniversity]);

  const managerGroup = {
    id: 'manager-group-id',
    name: 'Manager',
    path: '/Manager',
  };

  const keycloakClient = {
    getUserByEmail: jest.fn(),
    getUserById: jest.fn(),
    createAdministrator: jest.fn(),
    addRealmRoleToUser: jest.fn(),
    removeRealmRoleToUser: jest.fn(),
    getUserCredentials: jest.fn(),
    getAdministrators: jest.fn(),
    executeActionEmail: jest.fn(),
    updateUser: jest.fn(),
  };

  const createAdministratorUsecase = new CreateAdministratorUsecase(
    { get: jest.fn() } as unknown as ConfigService<Env, true>,
    keycloakClient as unknown as KeycloakClient,
    universityRepository,
  );
  const updateAdministratorUsecase = new UpdateAdministratorUsecase(
    keycloakClient as unknown as KeycloakClient,
    universityRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    keycloakClient.getUserByEmail.mockResolvedValue(undefined);
    keycloakClient.createAdministrator.mockResolvedValue({ id: 'admin-id' });
    keycloakClient.getUserCredentials.mockResolvedValue([{ type: 'password' }]);
    keycloakClient.getAdministrators.mockResolvedValue([]);
    keycloakClient.updateUser.mockResolvedValue({ id: 'admin-id' });
    keycloakClient.getUserById.mockResolvedValue({
      id: 'admin-id',
      email: 'felipe.brouardo@uam.es',
      firstName: 'Felipe',
      lastName: 'Brouardo',
      attributes: { universityId: [partnerUniversity.id] },
    });
  });

  it('Should refuse a central university administrator whose email is outside the university domains', async () => {
    await expect(
      createAdministratorUsecase.execute({
        email: 'felipe.brouardo@uam.es',
        firstname: 'Felipe',
        lastname: 'Brouardo',
        universityId: centralUniversity.id,
        group: managerGroup,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(keycloakClient.createAdministrator).not.toHaveBeenCalled();
    expect(keycloakClient.updateUser).not.toHaveBeenCalled();
  });

  it('Should accept a central university administrator on one of its domains, whatever the case', async () => {
    await createAdministratorUsecase.execute({
      email: 'Jean.Dupont@Univ-Lorraine.fr',
      firstname: 'Jean',
      lastname: 'Dupont',
      universityId: centralUniversity.id,
      group: managerGroup,
    });

    expect(keycloakClient.createAdministrator).toHaveBeenCalled();
  });

  it('Should accept any email for a partner university administrator', async () => {
    await createAdministratorUsecase.execute({
      email: 'felipe.brouardo@uam.es',
      firstname: 'Felipe',
      lastname: 'Brouardo',
      universityId: partnerUniversity.id,
      group: managerGroup,
    });

    expect(keycloakClient.createAdministrator).toHaveBeenCalled();
  });

  it('Should refuse moving an administrator to the central university with an email outside its domains', async () => {
    await expect(
      updateAdministratorUsecase.execute({
        id: 'admin-id',
        universityId: centralUniversity.id,
        group: managerGroup,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(keycloakClient.updateUser).not.toHaveBeenCalled();
  });

  it('Should not check the email when removing the admin role', async () => {
    keycloakClient.getUserById.mockResolvedValue({
      id: 'admin-id',
      email: 'felipe.brouardo@uam.es',
      firstName: 'Felipe',
      lastName: 'Brouardo',
      attributes: { universityId: [centralUniversity.id] },
    });

    await updateAdministratorUsecase.execute({
      id: 'admin-id',
      shouldRemoveAdminRole: true,
    });

    expect(keycloakClient.removeRealmRoleToUser).toHaveBeenCalled();
  });
});
