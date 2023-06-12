import { KeycloakClient } from '@app/keycloak';
import { Injectable } from '@nestjs/common';
import { Role, User } from '../../models/user';

export type CreateUserCommand = {
  email: string;
  password: string;
  roles: Role[];
};

@Injectable()
export class CreateUserUsecase {
  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(command: CreateUserCommand) {
    const { email, password, roles } = command;

    const keycloakUser = await this.keycloak.createUser({
      email,
      password,
      roles,
      enabled: true,
      emailVerified: false,
      origin: 'api',
    });

    const user = User.signUp(keycloakUser.id, keycloakUser.email);

    return user;
  }
}
