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
import { UploadAvatarUsecase } from 'src/core/usecases';
import {
  CreateAdministratorUsecase,
  CreateUserUsecase,
  DeleteAdministratorUsecase,
  DeleteUserUsecase,
  GetAdministratorUsecase,
  GetAdministratorsUsecase,
  GetUserUsecase,
  GetUsersUsecase,
  UpdateAdministratorUsecase,
  UpdateUserUsecase,
} from '../../core/usecases/user';
import { CollectionResponse, CurrentUser } from '../decorators';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  AdministratorResponse,
  CreateAdministratorRequest,
  CreateUserRequest,
  PaginationDto,
  UpdateAdministratorRequest,
  UpdateUserRequest,
  UserResponse,
} from '../dtos';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators/images.validator';
import { User } from 'src/core/models';
import { GetAdministratorsQueryParams } from 'src/api/dtos/users/administrators-filter';
import { RevokeSessionsUsecase } from 'src/core/usecases/user/revoke-sessions.usecase';

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
    private readonly getAdministratorsUsecase: GetAdministratorsUsecase,
    private readonly getAdministratorUsecase: GetAdministratorUsecase,
    private readonly createAdministratorUsecase: CreateAdministratorUsecase,
    private readonly updateAdministratorUsecase: UpdateAdministratorUsecase,
    private readonly deleteAdministratorUsecase: DeleteAdministratorUsecase,
    private readonly revokeSessionsUsecase: RevokeSessionsUsecase,
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
      user = new User({ ...user, avatar: upload });
    }

    return UserResponse.fromDomain(user);
  }

  @Get()
  @Roles(Role.ADMIN)
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

  @Get('administrators')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Administrator ressource.' })
  @CollectionResponse(UserResponse)
  async findAllAdministrators(
    @Query() { universityId }: GetAdministratorsQueryParams,
  ) {
    const administrators = await this.getAdministratorsUsecase.execute(
      universityId,
    );

    return administrators.map(AdministratorResponse.fromDomain);
  }

  @Get('administrators/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get an Administrator ressource.' })
  @CollectionResponse(UserResponse)
  async findAnAdministrator(@Param('id', ParseUUIDPipe) id: string) {
    const administrator = await this.getAdministratorUsecase.execute(id);

    return AdministratorResponse.fromDomain(administrator);
  }

  @Post('administrators')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create an Administrator ressource.' })
  @Swagger.ApiCreatedResponse({ type: AdministratorResponse })
  async createAdministrator(@Body() body: CreateAdministratorRequest) {
    const admin = await this.createAdministratorUsecase.execute(body);

    return AdministratorResponse.fromDomain(admin);
  }

  @Put('administrators')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update an Administrator ressource.' })
  @Swagger.ApiCreatedResponse({ type: AdministratorResponse })
  async updateAdministrator(@Body() body: UpdateAdministratorRequest) {
    const admin = await this.updateAdministratorUsecase.execute(body);

    return AdministratorResponse.fromDomain(admin);
  }

  @Delete('administrators/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete an administrator' })
  async deleteAdministrator(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteAdministratorUsecase.execute({ id });

    return;
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async findMe(@CurrentUser() user: KeycloakUser) {
    const id = user.sub;
    const me = await this.getUserUsecase.execute(id);

    return UserResponse.fromDomain(me);
  }

  @Get('revoke')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Revoke User sessions.' })
  async rekoveSessions(@CurrentUser() user: KeycloakUser) {
    await this.revokeSessionsUsecase.execute(user.sub);

    return;
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getUserUsecase.execute(id);

    return UserResponse.fromDomain(instance);
  }

  @Put()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates a User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async update(@Body() body: UpdateUserRequest) {
    const user = await this.updateUserUsecase.execute(body);

    return UserResponse.fromDomain(user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a User ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteUserUsecase.execute({ id });
  }
}
