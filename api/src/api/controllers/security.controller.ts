import { KeycloakClient } from '@app/keycloak';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  BearerTokensRequest,
  BearerTokensFromCodeRequest,
  BearerTokensResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from '../dtos';
import { configuration } from 'src/configuration';

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

  @Get('flow')
  @Swagger.ApiOperation({ summary: 'Initiate a standard browser login.' })
  @Swagger.ApiOkResponse({ type: BearerTokensResponse })
  async initiateStandardFlow(
    @Query('redirectUri') redirectUri: string,
    @Res() res,
  ): Promise<void> {
    if (!redirectUri) {
      this.logger.warn(
        'No redirect URI when initializing standard flow. Using default redirectUri',
      );
    }

    const url = this.keycloakClient.getStandardFlowUrl(
      redirectUri || `${configuration().appUrl}/auth`,
    );
    res.redirect(url);
  }

  @Post('flow/code')
  @Swagger.ApiOperation({ summary: 'Request a JWT token using grant code.' })
  @Swagger.ApiOkResponse({ type: BearerTokensResponse })
  async loginFromCode(
    @Body() { code, redirectUri }: BearerTokensFromCodeRequest,
  ): Promise<BearerTokensResponse> {
    const credentials =
      await this.keycloakClient.getCredentialsFromAuthorizationCode({
        authorizationCode: code,
        redirectUri,
      });

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
    const user = await this.keycloakClient.getUserByEmail(body.email);

    if (!user) {
      return;
    }

    await this.keycloakClient.executeActionEmail(
      ['UPDATE_PASSWORD'],
      user.id,
      `${configuration().appUrl}/login`,
    );

    return;
  }
}
