import { Body, Controller, Post, Logger } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { TokensResponse } from '../dtos/tokens/tokens.response';
import { TokensRequest } from '../dtos/tokens/tokens.request';
import { RefreshTokenRequest } from '../dtos/tokens/refresh-token.request';
import { GetTokensUsecase } from 'src/core/usecases/tokens/get-tokens.usecase';
import { RefreshTokensUsecase } from 'src/core/usecases/tokens/refresh-tokens.usecase';

@Controller('authentication')
@Swagger.ApiTags('Authentication')
export class SecurityController {
  private readonly logger = new Logger(SecurityController.name);

  constructor(
    private readonly getTokensUsecase: GetTokensUsecase,
    private readonly refreshTokensUsecase: RefreshTokensUsecase,
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
}
