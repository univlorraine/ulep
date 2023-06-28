import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { Role, User } from '../../models/user';
import { USER_REPOSITORY } from '../../../providers/providers.module';
import { UserRepository } from '../../ports/user.repository';
import { UserAlreadyExists } from '../../errors/RessourceAlreadyExists';

export type CreateUserCommand = {
  email: string;
  password: string;
  roles: Role[];
};

@Injectable()
export class CreateUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly keycloak: KeycloakClient,
  ) {}

  async execute(command: CreateUserCommand) {
    const { email, password, roles } = command;

    const userExists = await this.userRepository.ofEmail(email);
    if (userExists) {
      throw UserAlreadyExists.withEmailOf(email);
    }

    const keycloakUser = await this.keycloak.createUser({
      email,
      password,
      roles,
      enabled: true,
      emailVerified: false,
      origin: 'api',
    });

    const user = User.signUp(keycloakUser.id, keycloakUser.email);

    await this.userRepository.save(user);

    return user;
  }
}
