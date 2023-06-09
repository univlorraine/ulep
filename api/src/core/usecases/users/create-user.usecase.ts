import { KeycloakClient } from '@app/keycloak';
import { Injectable } from '@nestjs/common';
import { User } from '../../models/user';

export type CreateUserCommand = {
  email: string;
  password: string;
};

@Injectable()
export class CreateUserUsecase {
  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(command: CreateUserCommand) {
    const { email, password } = command;

    const keycloakUser = await this.keycloak.createUser({
      email,
      password,
      role: 'user',
      enabled: true,
      emailVerified: false,
      origin: 'api',
    });

    const user = User.signUp(keycloakUser.id, keycloakUser.email);

    return user;
  }
}
