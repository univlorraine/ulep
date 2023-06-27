/* eslint-disable @typescript-eslint/no-unused-vars */
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
  SerializeOptions,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { CreateUserUsecase } from '../../core/usecases/users/create-user.usecase';
import { ResetPasswordUsecase } from '../../core/usecases/users/reset-password.usecase';
import { Role } from '../../core/models/user';
import { GetUsersUsecase } from '../../core/usecases/users/get-users.usecase';
import { UserResponse } from '../dtos/users/user.response';
import { CreateUserRequest } from '../dtos/users/create-user.request';
import { ResetPasswordRequest } from '../dtos/users/reset-password.request';
import { PaginationDto } from '../dtos/pagination.dto';
import { CollectionResponse } from '../decorators/collection.decorator';
import { Collection } from '../../shared/types/collection';
import { GetUserUsecase } from 'src/core/usecases/users/get-user.usecase';

@Controller('users')
@Swagger.ApiTags('Users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly getUsersUsecase: GetUsersUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of user ressource.',
  })
  @CollectionResponse(UserResponse)
  async getCollection(
    @Query() { page, limit }: PaginationDto,
  ): Promise<Collection<UserResponse>> {
    const result = await this.getUsersUsecase.execute({
      page,
      limit,
    });

    return new Collection<UserResponse>(
      result.items.map(UserResponse.fromDomain),
      result.totalItems,
    );
  }

  @Get(':id')
  @SerializeOptions({ groups: ['read', 'user:read'] })
  @Swagger.ApiOperation({ summary: 'Retrieve a user ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponse> {
    const user = await this.getUserUsecase.execute({ id });

    return new UserResponse({
      id: user.id,
      email: user.email,
      roles: user.attributes.roles,
    });
  }

  @Post()
  @SerializeOptions({ groups: ['read', 'user:read'] })
  @Swagger.ApiOperation({ summary: 'Create user ressource' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async create(
    @Body() { email, password }: CreateUserRequest,
  ): Promise<UserResponse> {
    // TODO: get roles from the request body if admin authenticated
    const user = await this.createUserUsecase.execute({
      email,
      password,
      roles: [Role.USER],
    });

    return UserResponse.fromDomain(user);
  }

  @Put(':id/reset-password')
  @Swagger.ApiOperation({ summary: 'Update a user password.' })
  async resetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { password }: ResetPasswordRequest,
  ): Promise<void> {
    await this.resetPasswordUsecase.execute({ id, password });

    return;
  }
}
