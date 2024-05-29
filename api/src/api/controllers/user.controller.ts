import { Collection, I18nService } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { UploadAvatarUsecase } from 'src/core/usecases';
import { UploadAdminAvatarUsecase } from 'src/core/usecases';
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
  GetUserPersonalData,
  AddDeviceUsecase,
} from '../../core/usecases/user';
import { CollectionResponse, CurrentUser } from '../decorators';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  AddDeviceRequest,
  AdministratorResponse,
  CreateAdministratorRequest,
  CreateUserRequest,
  KeycloakGroupResponse,
  PaginationDto,
  UpdateAdministratorRequest,
  UpdateUserRequest,
  UserRepresentationWithAvatar,
  UserResponse,
} from '../dtos';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators/images.validator';
import { MediaObject, User } from 'src/core/models';
import { RevokeSessionsUsecase } from 'src/core/usecases/user/revoke-sessions.usecase';
import { OwnerAllowed } from '../decorators/owner.decorator';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { userPersonalDataToCsv } from '../dtos/users/csv-export.ts';
import { GetKeycloakAdminGroupsUsecase } from '../../core/usecases/user/get-keycloak-admin-groups.usecase';

@Controller('users')
@Swagger.ApiTags('Users')
export class UserController {
  constructor(
    private readonly addDeviceUsecase: AddDeviceUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly uploadAvatarUsecase: UploadAvatarUsecase,
    private readonly uploadAdminAvatarUsecase: UploadAdminAvatarUsecase,
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
    private readonly getUserPersonalData: GetUserPersonalData,
    private readonly getKeycloakAdminGroupsUsecase: GetKeycloakAdminGroupsUsecase,
    private readonly i18n: I18nService,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    private readonly env: ConfigService<Env, true>,
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
  async findAllAdministrators(@CurrentUser() user: KeycloakUser) {
    const administrators = await this.getAdministratorsUsecase.execute(user);

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
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create an Administrator ressource.' })
  @Swagger.ApiCreatedResponse({ type: AdministratorResponse })
  async createAdministrator(
    @Body() body: CreateAdministratorRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let admin: UserRepresentationWithAvatar =
      await this.createAdministratorUsecase.execute(body);

    if (file) {
      await this.uploadAdminAvatarUsecase.execute({
        userId: admin.id,
        file,
      });
      admin = {
        ...admin,
        image: MediaObject.image(
          file,
          MediaObject.getDefaultBucket(),
          admin.id,
        ),
      };
    }

    return AdministratorResponse.fromDomain(admin);
  }

  @Put('administrators')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update an Administrator ressource.' })
  @Swagger.ApiCreatedResponse({ type: AdministratorResponse })
  async updateAdministrator(
    @Body() body: UpdateAdministratorRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let admin: UserRepresentationWithAvatar =
      await this.updateAdministratorUsecase.execute(body);

    if (file) {
      await this.uploadAdminAvatarUsecase.execute({
        userId: admin.id,
        file,
      });
      admin = {
        ...admin,
        image: MediaObject.image(
          file,
          MediaObject.getDefaultBucket(),
          admin.id,
        ),
      };
    }

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

  @Post('revoke')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Revoke User sessions.' })
  async rekoveSessions(@CurrentUser() user: KeycloakUser) {
    return this.revokeSessionsUsecase.execute(user.sub);
  }

  @Post('add-device')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Add a device to a user.' })
  async addDevice(
    @CurrentUser() user: KeycloakUser,
    @Body() body: AddDeviceRequest,
  ) {
    return this.addDeviceUsecase.execute(user.sub, body);
  }

  @Get('admin/groups')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Keycloak groups.' })
  @CollectionResponse(KeycloakGroupResponse)
  async findAllKeycloakGroups() {
    const groups = await this.getKeycloakAdminGroupsUsecase.execute();

    return groups.map(KeycloakGroupResponse.fromDomain);
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

  @Post(':id')
  @Roles(Role.ADMIN)
  @OwnerAllowed((request) => request.params.id)
  @UseInterceptors(FileInterceptor('file'))
  @Swagger.ApiConsumes('multipart/form-data')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates a User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    let user = await this.updateUserUsecase.execute(id, body);

    if (file) {
      const upload = await this.uploadAvatarUsecase.execute({
        userId: user.id,
        file,
      });
      user = new User({ ...user, avatar: upload });
    }
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

  @Get(':id/export')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="test.csv"')
  @Swagger.ApiOperation({ summary: 'Export user data.' })
  async exportOne(@Param('id', ParseUUIDPipe) id: string) {
    const userData = await this.getUserPersonalData.execute(id);
    const avatarSignedUrl = userData.user.avatar
      ? await this.storage.temporaryUrl(
          userData.user.avatar.bucket,
          userData.user.avatar.name,
          this.env.get('SIGNED_URL_EXPIRATION_IN_SECONDS'),
        )
      : undefined;

    const appTranslationNs =
      this.env.get('APP_TRANSLATION_NAMESPACE') || 'translation';
    const apiTranslationNs = this.env.get('API_TRANSLATION_NAMESPACE') || 'api';

    const csv = userPersonalDataToCsv(
      {
        userData,
        avatarSignedUrl,
      },
      (value: string, opts?: { ns: string }) =>
        `${this.i18n.translate(value, {
          lng: userData.profile.nativeLanguage.code,
          ns: opts?.ns === 'translation' ? appTranslationNs : apiTranslationNs,
        })}`,
    );

    return new StreamableFile(csv);
  }
}
