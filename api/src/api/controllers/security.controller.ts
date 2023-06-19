import * as Keycloak from '@app/keycloak';
import { Body, Controller, Post, Logger } from '@nestjs/common';
import {
  LoginRequest,
  RefreshTokenRequest,
  LoginResponse,
} from '../dtos/security.dto';
import * as Swagger from '@nestjs/swagger';

@Controller('authentication')
@Swagger.ApiTags('Authentication')
export class SecurityController {
  private readonly logger = new Logger(SecurityController.name);

  constructor(private readonly keycloak: Keycloak.KeycloakClient) {}

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
