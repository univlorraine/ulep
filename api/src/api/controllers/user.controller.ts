import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Collection } from '@app/common';
import {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  PaginationDto,
} from '../dtos';
import {
  CreateUserUsecase,
  DeleteUserUsecase,
  GetUsersUsecase,
  GetUserUsecase,
  UpdateUserUsecase,
} from '../../core/usecases/user';
import { CollectionResponse } from '../decorators';
import { AuthenticationGuard } from '../guards';

@Controller('users')
@Swagger.ApiTags('Users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly getUsersUsecase: GetUsersUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly updateUserUsecase: UpdateUserUsecase,
    private readonly deleteUserUsecase: DeleteUserUsecase,
  ) {}

  @Post()
  @Swagger.ApiOperation({ summary: 'Create a new User ressource.' })
  @Swagger.ApiCreatedResponse({ type: UserResponse })
  async create(@Body() body: CreateUserRequest) {
    const instance = await this.createUserUsecase.execute({ ...body });

    return UserResponse.fromDomain(instance);
  }

  @Get()
  @Swagger.ApiOperation({ summary: 'Collection of User ressource.' })
  @CollectionResponse(UserResponse)
  async findAll(@Query() { page, limit }: PaginationDto) {
    const instances = await this.getUsersUsecase.execute({
      page,
      limit,
    });

    return new Collection<UserResponse>({
      items: instances.items.map(UserResponse.fromDomain),
      totalItems: instances.totalItems,
    });
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getUserUsecase.execute(id);

    return UserResponse.fromDomain({ id, ...instance });
  }

  @Patch(':id')
  @Swagger.ApiOperation({ summary: 'Updates a User ressource.' })
  @Swagger.ApiOkResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateUserRequest,
  ) {
    await this.updateUserUsecase.execute({ id, ...request });
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a User ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteUserUsecase.execute({ id });
  }
}
