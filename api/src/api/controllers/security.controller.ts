import { KeycloakClient } from '@app/keycloak';
import { Body, Controller, Post, Logger } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  BearerTokensRequest,
  BearerTokensResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from '../dtos';

@Controller('authentication')
@Swagger.ApiTags('Authentication')
export class SecurityController {
  private readonly logger = new Logger(SecurityController.name);

  constructor(private readonly keycloakClient: KeycloakClient) {}

  @Post('token')
  @Swagger.ApiOperation({ summary: 'Request a JWT token.' })
  @Swagger.ApiOkResponse({ type: BearerTokensResponse })
  async login(
    @Body() { email, password }: BearerTokensRequest,
  ): Promise<BearerTokensResponse> {
    const credentials = await this.keycloakClient.getCredentials(
      email,
      password,
    );

    return new BearerTokensResponse(credentials);
  }

  @Post('refresh-token')
  @Swagger.ApiOperation({ summary: 'Request a JWT token.' })
  @Swagger.ApiOkResponse({ type: BearerTokensResponse })
  async refreshToken(
    @Body() { token }: RefreshTokenRequest,
  ): Promise<BearerTokensResponse> {
    const credentials = await this.keycloakClient.refreshToken(token);

    return new BearerTokensResponse(credentials);
  }

  @Post('reset-password')
  @Swagger.ApiOperation({ summary: 'Send email to reset user password' })
  async resetPassword(@Body() body: ResetPasswordRequest): Promise<void> {
    await this.keycloakClient.executeActionEmail(
      ['UPDATE_PASSWORD'],
      body.userId,
      body.redirectUri,
    );

    return;
  }
}
