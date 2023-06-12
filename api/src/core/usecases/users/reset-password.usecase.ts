import { KeycloakClient } from '@app/keycloak';
import { Injectable } from '@nestjs/common';

export class ResetPasswordCommand {
  id: string;
  password: string;
}

@Injectable()
export class ResetPasswordUsecase {
  constructor(private readonly keycloakClient: KeycloakClient) {}

  async execute({ id, password }: ResetPasswordCommand): Promise<void> {
    await this.keycloakClient.resetPassword(id, password);
  }
}
