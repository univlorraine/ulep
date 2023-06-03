import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequest } from './login.request';
import { LoginResponse } from './login.response';

@Controller('authentication')
@ApiTags('Auth')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  @Post('token')
  @ApiOkResponse({ type: LoginResponse })
  async login(@Body() { email, password }: LoginRequest) {
    this.logger.debug(`Login attempt for ${email} with password ${password}`);

    throw new Error('Not implemented');
  }
}
