import { Credentials, KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { UserDoesNotExist } from '../../errors/RessourceDoesNotExist';
import { UserRepository } from '../../ports/user.repository';
import { USER_REPOSITORY } from '../../../providers/providers.module';

export class GetTokensCommand {
  email: string;
  password: string;
}

@Injectable()
export class GetTokensUsecase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(command: GetTokensCommand): Promise<Credentials> {
    const { email, password } = command;

    const user = await this.userRepository.ofEmail(email);
    if (!user) {
      throw UserDoesNotExist.withEmailOf(email);
    }

    const credentials = await this.keycloak.getCredentials(email, password);

    return credentials;
  }
}
