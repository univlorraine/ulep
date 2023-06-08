import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { CreateUserRequest } from './create-user.request';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserUsecase } from '../usecases/create-user.usecase';
import { AuthenticationGuard } from '@app/keycloak';
import { CreateUserResponse } from './create-user.response';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Create user ressource' })
  @ApiOkResponse({ type: CreateUserResponse })
  async create(
    @Body() { email, password }: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    const user = await this.createUserUsecase.execute({ email, password });

    return { id: user.getId(), email: user.getEmail() };
  }
}
