/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { KeycloakClient, KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Swagger from '@nestjs/swagger';
import { Response } from 'express';
import { Env } from 'src/configuration';
import { GetJitsiTokenUsecase } from 'src/core/usecases/jitsi/get-jitsi-token.usecase';
import { LogoutAllSessionsUsecase } from 'src/core/usecases/security/logout-all-sessions.usecase';
import { ResetAdminPasswordUsecase } from 'src/core/usecases/security/reset-admin-password.usecase';
import { ResetPasswordUsecase } from 'src/core/usecases/security/reset-password.usecase';
import { TokenForAdminUsecase } from 'src/core/usecases/security/token-for-admin.usecase';
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
  #adminUrl: string;

  constructor(
    private readonly keycloakClient: KeycloakClient,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
    private readonly resetAdminPasswordUsecase: ResetAdminPasswordUsecase,
    private readonly logoutAllSessionsUsecase: LogoutAllSessionsUsecase,
    private readonly tokenForAdminUsecase: TokenForAdminUsecase,
    private readonly getJitsiTokenUsecase: GetJitsiTokenUsecase,
    env: ConfigService<Env, true>,
  ) {
    this.#appUrl = env.get('APP_URL');
    this.#adminUrl = env.get('ADMIN_URL');
  }

  @Post('token/admin')
  @Swagger.ApiOperation({ summary: 'Request a JWT token for admin.' })
  @Swagger.ApiOkResponse({ type: BearerTokensResponse })
  async loginAdmin(
    @Body() { email, password }: BearerTokensRequest,
  ): Promise<BearerTokensResponse> {
    const credentials = await this.tokenForAdminUsecase.execute({
      email,
      password,
    });

    return new BearerTokensResponse(credentials);
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

  @Get('logout-all-sessions/:login')
  @Swagger.ApiOperation({ summary: 'Logout user by email.' })
  @Swagger.ApiOkResponse({ type: LogoutResponse })
  async logout(
    @Param('login') login: string,
    @Headers('Authorization') token?: string,
  ): Promise<LogoutResponse> {
    const success = await this.logoutAllSessionsUsecase.execute({
      login,
      token: token?.replace('Bearer ', ''),
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
    @Res() res: Response,
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

  @Post('administrators/reset-password')
  @Swagger.ApiOperation({ summary: 'Send email to reset admin password' })
  async resetAdminPassword(@Body() body: ResetPasswordRequest): Promise<void> {
    return await this.resetAdminPasswordUsecase.execute({
      email: body.email,
      loginUrl: `${this.#adminUrl}`,
    });
  }
}
