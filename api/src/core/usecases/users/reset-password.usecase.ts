import { KeycloakClient } from '@app/keycloak';
import { Injectable } from '@nestjs/common';

export class ResetPasswordCommand {
  userId: string;
  redirectUri?: string;
}

@Injectable()
export class ResetPasswordUsecase {
  constructor(private readonly keycloakClient: KeycloakClient) {}

  async execute({ userId, redirectUri }: ResetPasswordCommand): Promise<void> {
    await this.keycloakClient.executeActionEmail(
      ['UPDATE_PASSWORD'],
      userId,
      redirectUri,
    );
  }
}
