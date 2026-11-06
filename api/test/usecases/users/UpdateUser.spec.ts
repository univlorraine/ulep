import { UniversityFactory, UserFactory } from '@app/common';
import { KeycloakClient } from '@app/keycloak';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { UserStatus } from 'src/core/models';
import { UpdateUserUsecase } from 'src/core/usecases/user/update-user.usecase';
import { InMemoryProfileRepository } from 'src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryTandemHistoryRepository } from 'src/providers/persistance/repositories/in-memory-tandem-history.repository';
import { InMemoryTandemRepository } from 'src/providers/persistance/repositories/in-memory-tandem-repository';
import { InMemoryUserRepository } from 'src/providers/persistance/repositories/in-memory-user-repository';

describe('UpdateUser', () => {
  const userRepository = new InMemoryUserRepository();
  const keycloakClient = {
    updateUser: jest.fn().mockResolvedValue(undefined),
  };
  const chatService = {
    createConversation: jest.fn().mockResolvedValue(undefined),
    deleteConversationByUserId: jest.fn().mockResolvedValue(undefined),
  };
  const communityChatRepository = { all: jest.fn().mockResolvedValue([]) };

  const updateUserUsecase = new UpdateUserUsecase(
    userRepository,
    new InMemoryProfileRepository(),
    new InMemoryTandemRepository(),
    {} as never,
    new InMemoryTandemHistoryRepository(),
    chatService as never,
    communityChatRepository as never,
    { get: jest.fn() } as unknown as ConfigService<Env, true>,
    keycloakClient as unknown as KeycloakClient,
  );

  const university = new UniversityFactory().makeOne();
  const user = new UserFactory().makeOne({
    university,
    contactId: 'university-contact-keycloak-id',
  });

  beforeEach(() => {
    userRepository.init([user]);
    keycloakClient.updateUser.mockClear();
  });

  it('Should update the Keycloak account of the user, not the one of their university contact', async () => {
    await updateUserUsecase.execute(user.id, { firstname: 'Christina' });

    expect(keycloakClient.updateUser).toHaveBeenCalledTimes(1);
    expect(keycloakClient.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ id: user.id, newFirstName: 'Christina' }),
    );
  });

  it('Should cancel a user without touching any Keycloak account', async () => {
    await updateUserUsecase.execute(user.id, { status: UserStatus.CANCELED });

    expect(keycloakClient.updateUser).not.toHaveBeenCalled();
  });
});
