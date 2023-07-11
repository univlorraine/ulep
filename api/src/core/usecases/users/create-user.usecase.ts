import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { UserRole, User } from '../../models/user';
import { USER_REPOSITORY } from '../../../providers/providers.module';
import { UserRepository } from '../../ports/user.repository';

export type CreateUserCommand = {
  email: string;
  password: string;
  roles?: UserRole[];
};

@Injectable()
export class CreateUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(command: CreateUserCommand) {
    const { email, password, roles } = command;

    const keycloakUser = await this.keycloak.createUser({
      email,
      password,
      roles: roles ?? [],
      enabled: true,
      emailVerified: false,
      origin: 'api',
    });

    let user = await this.userRepository.ofId(keycloakUser.id);
    if (!user) {
      user = User.signUp(keycloakUser.id, keycloakUser.email);

      await this.userRepository.save(user);
    }

    return user;
  }
}
