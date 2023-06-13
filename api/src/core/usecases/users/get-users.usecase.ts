import { GetUsersProps, KeycloakClient } from '@app/keycloak';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/core/models/user';
import { Paginator } from 'src/shared/types/paginator';

export class GetUsersCommand {
  email?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class GetUsersUsecase {
  private readonly logger = new Logger(GetUsersUsecase.name);

  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(command: GetUsersCommand): Promise<Paginator<User>> {
    const { email, page, limit } = command;
    const payload: GetUsersProps = {};
    let offset = 0;

    if (page && limit) {
      offset = (page - 1) * limit;
      payload.first = offset;
    }

    if (email) {
      payload.email = email;
    }

    if (limit) {
      payload.max = limit;
    }

    const result = await this.keycloak.getUsers(payload);

    const users = result.map((keycloakUser) =>
      User.signUp(keycloakUser.id, keycloakUser.email),
    );

    return new Paginator(users, offset, limit, users.length);
  }
}
