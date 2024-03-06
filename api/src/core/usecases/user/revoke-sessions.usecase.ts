import { Injectable, Logger } from '@nestjs/common';
import { KeycloakClient } from '@app/keycloak';

@Injectable()
export class RevokeSessionsUsecase {
  private readonly logger = new Logger(RevokeSessionsUsecase.name);

  constructor(private readonly keycloakClient: KeycloakClient) {}

  async execute(id: string): Promise<void> {
    try {
      await this.keycloakClient.logoutUser(id);
    } catch (error) {
      this.logger.error(`Error revoke sessions to user ${id} : ${error}`);
      throw error;
    }
  }
}
