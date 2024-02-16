import { Inject, Injectable, Logger } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import { KeycloakClient } from '@app/keycloak';

@Injectable()
export class RevokeSessionsUsecase {
  private readonly logger = new Logger(RevokeSessionsUsecase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.ofId(id);

    if (!user) {
      throw new RessourceDoesNotExist();
    }

    try {
      await this.keycloakClient.userLogout(user.id);
    } catch (error) {
      this.logger.error(`Error revoke sessions to user ${user.id} : ${error}`);
    }
  }
}
