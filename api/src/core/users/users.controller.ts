import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { CreateUserRequest } from './dtos/create-user.request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserUsecase } from './usecases/create-user.usecase';
import { AuthenticationGuard } from '@app/keycloak';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Create user ressource' })
  async create(@Body() { email, password }: CreateUserRequest) {
    await this.createUserUsecase.execute({ email, password });

    return;
  }
}
