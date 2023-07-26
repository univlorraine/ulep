import { Body, Controller, Post, Logger } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { TokensResponse } from '../dtos/security/tokens.response';
import { TokensRequest } from '../dtos/security/tokens.request';
import { RefreshTokenRequest } from '../dtos/security/refresh-token.request';
import { GetTokensUsecase } from 'src/core/usecases/tokens/get-tokens.usecase';
import { RefreshTokensUsecase } from 'src/core/usecases/tokens/refresh-tokens.usecase';
import { ResetPasswordUsecase } from 'src/core/usecases/users/reset-password.usecase';
import { ResetPasswordRequest } from '../dtos/security/reset-password.request';

@Controller('authentication')
@Swagger.ApiTags('Authentication')
export class SecurityController {
  private readonly logger = new Logger(SecurityController.name);

  constructor(
    private readonly getTokensUsecase: GetTokensUsecase,
    private readonly refreshTokensUsecase: RefreshTokensUsecase,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
  ) {}

  @Post('token')
  @Swagger.ApiOperation({ summary: 'Request a JWT token.' })
  @Swagger.ApiOkResponse({ type: TokensResponse })
  async login(
    @Body() { email, password }: TokensRequest,
  ): Promise<TokensResponse> {
    const credentials = await this.getTokensUsecase.execute({
      email,
      password,
    });

    return new TokensResponse(credentials);
  }

  @Post('refresh-token')
  @Swagger.ApiOperation({ summary: 'Request a JWT token.' })
  @Swagger.ApiOkResponse({ type: TokensResponse })
  async refreshToken(
    @Body() { token }: RefreshTokenRequest,
  ): Promise<TokensResponse> {
    const credentials = await this.refreshTokensUsecase.execute({ token });

    return new TokensResponse(credentials);
  }

  @Post('reset-password')
  @Swagger.ApiOperation({ summary: 'Send email to reset user password' })
  async resetPassword(@Body() body: ResetPasswordRequest): Promise<void> {
    await this.resetPasswordUsecase.execute({ ...body });

    return;
  }
}
