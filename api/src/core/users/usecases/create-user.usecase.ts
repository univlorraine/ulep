import { KeycloakClient } from '@app/keycloak';
import { Injectable, Logger } from '@nestjs/common';
import { Role, User } from '../domain/user';

export type CreateUserCommand = {
  email: string;
  password: string;
  role?: Role;
};

@Injectable()
export class CreateUserUsecase {
  private readonly logger = new Logger(CreateUserUsecase.name);

  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { email, password, role } = command;
    const roles = [role] ?? [Role.USER];

    const keycloakUser = await this.keycloak.createUser({
      email,
      password,
      roles,
      enabled: true,
      emailVerified: false,
      origin: 'api',
    });

    const user = User.signUp(keycloakUser.id, keycloakUser.email, roles);

    return user;
  }
}
