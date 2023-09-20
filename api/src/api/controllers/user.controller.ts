import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { configuration } from 'src/configuration';
import { UploadAvatarUsecase } from 'src/core/usecases';
import {
  CreateUserUsecase,
  DeleteUserUsecase,
  GetUserUsecase,
  GetUsersUsecase,
  UpdateUserUsecase,
} from '../../core/usecases/user';
import { CollectionResponse, CurrentUser } from '../decorators';
import { Roles } from '../decorators/roles.decorator';
import {
  CreateUserRequest,
  PaginationDto,
  UpdateUserRequest,
  UserResponse,
} from '../dtos';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators/images.validator';

@Controller('users')
@Swagger.ApiTags('Users')
export class UserController {
  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly uploadAvatarUsecase: UploadAvatarUsecase,
    private readonly getUsersUsecase: GetUsersUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly updateUserUsecase: UpdateUserUsecase,
    private readonly deleteUserUsecase: DeleteUserUsecase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Swagger.ApiOperation({ summary: 'Create a new User ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiCreatedResponse({ type: UserResponse })
  async create(
    @Body() body: CreateUserRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let user = await this.createUserUsecase.execute({ ...body });
    if (file) {
      const upload = await this.uploadAvatarUsecase.execute({
        userId: user.id,
        file,
      });
      user = { ...user, avatar: upload };
    }

    return UserResponse.fromDomain(user);
  }

  @Get()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of User ressource.' })
  @CollectionResponse(UserResponse)
  async findAll(@Query() { page, limit }: PaginationDto) {
    const users = await this.getUsersUsecase.execute({
      page,
      limit,
    });

    return new Collection<UserResponse>({
      items: users.items.map(UserResponse.fromDomain),
      totalItems: users.totalItems,
    });
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async findMe(@CurrentUser() user: KeycloakUser) {
    const id = user.sub;
    const me = await this.getUserUsecase.execute(id);

    return UserResponse.fromDomain({ id, ...me });
  }

  @Get(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getUserUsecase.execute(id);

    return UserResponse.fromDomain({ id, ...instance });
  }

  @Put()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates a User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async update(@Body() body: UpdateUserRequest) {
    const user = await this.updateUserUsecase.execute(body);

    return UserResponse.fromDomain(user);
  }

  @Delete(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a User ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteUserUsecase.execute({ id });
  }
}
