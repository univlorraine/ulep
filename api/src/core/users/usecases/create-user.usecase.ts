import { KeycloakClient } from '@app/keycloak';
import { Injectable, Logger } from '@nestjs/common';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export type CreateUserCommand = {
  email: string;
  password: string;
  role?: Role;
};

@Injectable()
export class CreateUserUsecase {
  private readonly logger = new Logger(CreateUserUsecase.name);

  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(command: CreateUserCommand) {
    const { email, password, role } = command;

    await this.keycloak.createUser({
      email,
      password,
      roles: [role] ?? [Role.USER],
      enabled: true,
      emailVerified: false,
      origin: 'api',
    });
  }
}
