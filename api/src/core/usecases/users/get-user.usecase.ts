import { KeycloakClient } from '@app/keycloak';
import { Injectable } from '@nestjs/common';
import { UserDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';

export type GetUserCommand = {
  id: string;
};

@Injectable()
export class GetUserUsecase {
  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(command: GetUserCommand) {
    const user = await this.keycloak.getUserById(command.id);

    if (!user) {
      throw UserDoesNotExist.withIdOf(command.id);
    }

    return user;
  }
}
