import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Collection } from '@app/common';
import {
  UserResponse,
  CreateUserRequest,
  PaginationDto,
  UpdateUserRequest,
  AskForAccountDeletionRequest,
} from '../dtos';
import {
  AskForAccountDeletionUsecase,
  CreateUserUsecase,
  DeleteUserUsecase,
  GetUsersUsecase,
  GetUserUsecase,
  UpdateUserUsecase,
} from '../../core/usecases/user';
import { CollectionResponse } from '../decorators';
import { AuthenticationGuard } from '../guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesFilePipe } from '../validators/images.validator';
import { UploadAvatarUsecase } from 'src/core/usecases';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';

@Controller('users')
@Swagger.ApiTags('Users')
export class UserController {
  constructor(
    private readonly askForAccountDeletionUsecase: AskForAccountDeletionUsecase,
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
    @UploadedFile(new ImagesFilePipe()) file: Express.Multer.File,
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
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getUserUsecase.execute(id);

    return UserResponse.fromDomain({ id, ...instance });
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates a User ressource.' })
  @Swagger.ApiOkResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateUserRequest,
  ) {
    await this.updateUserUsecase.execute({ id, ...request });
  }

  @Post(':id/ask-deletion')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Ask for account deletion.' })
  @Swagger.ApiOkResponse()
  async askForAccountDeletion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { reason }: AskForAccountDeletionRequest,
  ) {
    await this.askForAccountDeletionUsecase.execute({ user: id, reason });
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
