import { KeycloakClient } from '@app/keycloak';
import { Body, Controller, Post } from '@nestjs/common';
import {
  LoginRequest,
  RefreshTokenRequest,
  LoginResponse,
} from '../dtos/security.dto';
import * as Swagger from '@nestjs/swagger';

@Controller('authentication')
@Swagger.ApiTags('Authentication')
export class SecurityController {
  constructor(private readonly keycloak: KeycloakClient) {}

  @Post('token')
  @Swagger.ApiOperation({ summary: 'Request a JWT token.' })
  @Swagger.ApiOkResponse({ type: LoginResponse })
  async login(
    @Body() { email, password }: LoginRequest,
  ): Promise<LoginResponse> {
    const credentials = await this.keycloak.getCredentials(email, password);

    return credentials;
  }

  @Post('refresh-token')
  @Swagger.ApiOperation({ summary: 'Request a JWT token.' })
  @Swagger.ApiOkResponse({ type: LoginResponse })
  async refreshToken(
    @Body() { token }: RefreshTokenRequest,
  ): Promise<LoginResponse> {
    const credentials = await this.keycloak.refreshToken(token);

    return credentials;
  }
}
