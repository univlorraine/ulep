import { KeycloakClient } from '@app/keycloak';
import { UpdateAdministratorUsecase } from 'src/core/usecases/user/update-administrator.usecase';
import { InMemoryUniversityRepository } from 'src/providers/persistance/repositories/in-memory-university-repository';

describe('UpdateAdministrator', () => {
  const administrator = {
    id: 'administrator-id',
    email: 'felipe.brouardo@uam.es',
    firstName: 'Felipe',
    lastName: 'Brouardo',
  };

  const keycloakClient = {
    getUserById: jest.fn().mockResolvedValue(administrator),
    removeRealmRoleToUser: jest.fn().mockResolvedValue(undefined),
    removeUserFromAdminGroups: jest.fn().mockResolvedValue(undefined),
    updateUser: jest.fn().mockResolvedValue(administrator),
  };

  const updateAdministratorUsecase = new UpdateAdministratorUsecase(
    keycloakClient as unknown as KeycloakClient,
    new InMemoryUniversityRepository(),
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should take the user out of the admin groups when removing their admin role', async () => {
    await updateAdministratorUsecase.execute({
      id: administrator.id,
      shouldRemoveAdminRole: true,
    });

    expect(keycloakClient.removeRealmRoleToUser).toHaveBeenCalledWith(
      administrator.id,
      'admin',
    );
    expect(keycloakClient.removeUserFromAdminGroups).toHaveBeenCalledWith(
      administrator.id,
    );
  });

  it('Should leave the groups alone on a regular update', async () => {
    await updateAdministratorUsecase.execute({
      id: administrator.id,
      firstname: 'Felipe',
    });

    expect(keycloakClient.removeUserFromAdminGroups).not.toHaveBeenCalled();
  });
});
