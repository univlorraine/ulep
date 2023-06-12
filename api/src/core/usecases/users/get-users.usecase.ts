import { GetUsersProps, KeycloakClient } from '@app/keycloak';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/core/models/user';
import { Collection } from 'src/shared/types/collection';

export class GetUsersCommand {
  filter: string;
  page: number;
  limit: number;
}

@Injectable()
export class GetUsersUsecase {
  private readonly logger = new Logger(GetUsersUsecase.name);

  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(command: GetUsersCommand): Promise<Collection<User>> {
    const { filter, page, limit } = command;
    const offset = (page - 1) * limit;
    const payload: GetUsersProps = { first: offset, max: limit };

    if (filter) {
      payload.email = filter;
    }

    const result = await this.keycloak.getUsers(payload);

    const users = result.map((keycloakUser) =>
      User.signUp(keycloakUser.id, keycloakUser.email),
    );

    return { items: users, total: users.length };
  }
}
