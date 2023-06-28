import * as Keycloak from '@app/keycloak';
import { Body, Controller, Post, Logger } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { TokensResponse } from '../dtos/tokens/tokens.response';
import { TokensRequest } from '../dtos/tokens/tokens.request';
import { RefreshTokenRequest } from '../dtos/tokens/refresh-token.request';

@Controller('authentication')
@Swagger.ApiTags('Authentication')
export class SecurityController {
  private readonly logger = new Logger(SecurityController.name);

  constructor(private readonly keycloak: Keycloak.KeycloakClient) {}

  @Post('token')
  @Swagger.ApiOperation({ summary: 'Request a JWT token.' })
  @Swagger.ApiOkResponse({ type: TokensResponse })
  async login(
    @Body() { email, password }: TokensRequest,
  ): Promise<TokensResponse> {
    const credentials = await this.keycloak.getCredentials(email, password);

    return credentials;
  }

  @Post('refresh-token')
  @Swagger.ApiOperation({ summary: 'Request a JWT token.' })
  @Swagger.ApiOkResponse({ type: TokensResponse })
  async refreshToken(
    @Body() { token }: RefreshTokenRequest,
  ): Promise<TokensResponse> {
    const credentials = await this.keycloak.refreshToken(token);

    return credentials;
  }
}
