/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthenticationGuard } from '@app/keycloak';
import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  Param,
  ParseUUIDPipe,
  Put,
  Response,
  Query,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { UserRead, UserCreate, ResetPasswordRequest } from '../dtos/users.dto';
import { CreateUserUsecase } from 'src/core/usecases/users/create-user.usecase';
import { ResetPasswordUsecase } from 'src/core/usecases/users/reset-password.usecase';
import { Role } from 'src/core/models/user';
import { GetUsersUsecase } from 'src/core/usecases/users/get-users.usecase';
import { GetUsersPaginationDto } from 'src/api/dtos/get-users-pagination.dto';

@Controller('users')
@Swagger.ApiTags('Users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly getUsersUsecase: GetUsersUsecase,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of User ressource.',
  })
  @Swagger.ApiOkResponse({ type: UserRead, isArray: true })
  async getCollection(
    @Response() res,
    @Query() { email, page, limit }: GetUsersPaginationDto,
  ): Promise<void> {
    const result = await this.getUsersUsecase.execute({
      email,
      page,
      limit,
    });

    const resultMaxUsers = await this.getUsersUsecase.execute({ email });

    res
      .set({
        'Content-range': `bytes ${result.firstIndex}-${result.lastIndex}/${resultMaxUsers.total}`,
      })
      .json({
        items: result.items.map(UserRead.fromDomain),
        total: result.total,
      });
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Retrieve a User ressource.' })
  @Swagger.ApiOkResponse({ type: UserRead })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(@Param('id', ParseUUIDPipe) id: string): Promise<UserRead> {
    throw new Error('Not implemented');
  }

  @Post()
  @Swagger.ApiOperation({ summary: 'Create user ressource' })
  @Swagger.ApiOkResponse({ type: UserRead })
  async create(@Body() { email, password }: UserCreate): Promise<UserRead> {
    // TODO: get roles from the request body if admin authenticated
    const user = await this.createUserUsecase.execute({
      email,
      password,
      roles: [Role.USER],
    });

    return { id: user.getId(), email: user.getEmail() };
  }

  @Put(':id/reset-password')
  @Swagger.ApiOperation({ summary: 'Update a User password.' })
  async resetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { password }: ResetPasswordRequest,
  ): Promise<void> {
    await this.resetPasswordUsecase.execute({ id, password });

    return;
  }
}
