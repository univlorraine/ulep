import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequest } from './dtos/login.request';
import { LoginResponse } from './dtos/login.response';
import { KeycloakClient } from '@app/keycloak';
import { RefreshTokenRequest } from './dtos/refresh-token.request';

@Controller('authentication')
@ApiTags('Auth')
export class AuthenticationController {
  constructor(private readonly keycloak: KeycloakClient) {}

  @Post('token')
  @ApiOkResponse({ type: LoginResponse })
  async login(
    @Body() { email, password }: LoginRequest,
  ): Promise<LoginResponse> {
    const credentials = await this.keycloak.getCredentials(email, password);

    return credentials;
  }

  @Post('refresh-token')
  @ApiOkResponse({ type: LoginResponse })
  async refreshToken(@Body() { token }: RefreshTokenRequest) {
    const credentials = await this.keycloak.refreshToken(token);

    return credentials;
  }
}
