import { KeycloakClient, KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Swagger from '@nestjs/swagger';
import { Env } from 'src/configuration';
import { GetJitsiTokenUsecase } from 'src/core/usecases/jitsi/get-jitsi-token.usecase';
import { LogoutAllSessionsUsecase } from 'src/core/usecases/security/logout-all-sessions.usecase';
import { ResetPasswordUsecase } from 'src/core/usecases/security/reset-password.usecase';
import { CurrentUser } from '../decorators';
import {
  BearerTokensFromCodeRequest,
  BearerTokensRequest,
  BearerTokensResponse,
  JitsiTokensResponse,
  LogoutResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from '../dtos';
import { AuthenticationGuard } from '../guards';

@Controller('authentication')
@Swagger.ApiTags('Authentication')
export class SecurityController {
  private readonly logger = new Logger(SecurityController.name);

  #appUrl: string;

  constructor(
    private readonly keycloakClient: KeycloakClient,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
    private readonly logoutAllSessionsUsecase: LogoutAllSessionsUsecase,
    private readonly getJitsiTokenUsecase: GetJitsiTokenUsecase,
    env: ConfigService<Env, true>,
  ) {
    this.#appUrl = env.get('APP_URL');
  }

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

  @Get('logout-all-sessions/:token/:login')
  @Swagger.ApiOperation({ summary: 'Logout user by email.' })
  @Swagger.ApiOkResponse({ type: LogoutResponse })
  async logout(
    @Param('login') login: string,
    @Param('token') token: string,
  ): Promise<LogoutResponse> {
    const success = await this.logoutAllSessionsUsecase.execute({
      login,
      token,
    });

    return new LogoutResponse({ success });
  }

  @Get('jitsi/token')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Request a Jisti JWT token.' })
  @Swagger.ApiOkResponse({ type: JitsiTokensResponse })
  async getJitsiToken(
    @CurrentUser() user: KeycloakUser,
  ): Promise<JitsiTokensResponse> {
    const token = await this.getJitsiTokenUsecase.execute(user);

    return new JitsiTokensResponse({ token });
  }

  @Get('flow')
  @Swagger.ApiOperation({ summary: 'Initiate a standard browser login.' })
  @Swagger.ApiResponse({ status: 302 })
  async initiateStandardFlow(
    @Query('redirectUri') redirectUri: string,
    @Res() res,
  ): Promise<void> {
    const redirect = redirectUri || `${this.#appUrl}/auth`;

    const url = await this.keycloakClient.getStandardFlowUrl(redirect);

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
    return await this.resetPasswordUsecase.execute({
      email: body.email,
      loginUrl: `${this.#appUrl}/login`,
    });
  }
}
