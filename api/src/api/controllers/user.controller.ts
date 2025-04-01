/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { Env } from 'src/configuration';
import { MediaObject, User } from 'src/core/models';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';
import {
  UploadAdminAvatarUsecase,
  UploadAvatarUsecase,
} from 'src/core/usecases';
import { RevokeSessionsUsecase } from 'src/core/usecases/user/revoke-sessions.usecase';
import {
  AddDeviceUsecase,
  CreateAdministratorUsecase,
  CreateUserUsecase,
  DeleteAdministratorUsecase,
  DeleteUserUsecase,
  GetAdministratorsUsecase,
  GetAdministratorUsecase,
  GetUserPersonalData,
  GetUsersUsecase,
  GetUserUsecase,
  UpdateAdministratorUsecase,
  UpdateUserUsecase,
} from '../../core/usecases/user';
import { GetKeycloakAdminGroupsUsecase } from '../../core/usecases/user/get-keycloak-admin-groups.usecase';
import { CollectionResponse, CurrentUser } from '../decorators';
import { OwnerAllowed } from '../decorators/owner.decorator';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  AddDeviceRequest,
  AdministratorResponse,
  AdministratorsQuery,
  CreateAdministratorRequest,
  CreateUserRequest,
  KeycloakGroupResponse,
  PaginationDto,
  UpdateAdministratorRequest,
  UpdateUserRequest,
  UserRepresentationWithAvatar,
  UserResponse,
} from '../dtos';
import { userPersonalDataToCsv } from '../dtos/users/csv-export.ts';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators/images.validator';

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
  @Swagger.ApiCreatedResponse({ type: () => UserResponse })
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
    @CurrentUser() user: KeycloakUser,
    @Query() query: AdministratorsQuery,
  ) {
    const administrators = await this.getAdministratorsUsecase.execute(
      user,
      query,
    );

    return administrators.map(AdministratorResponse.fromDomain);
  }

  @Get('administrators/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get an Administrator ressource.' })
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
        image: MediaObject.generate(
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
        image: MediaObject.generate(
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
    const user = await this.getUserUsecase.execute(id, false);

    if (user) {
      return await this.updateAdministratorUsecase.execute({
        id,
        shouldRemoveAdminRole: true,
      });
    } else {
      return await this.deleteAdministratorUsecase.execute({ id });
    }
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'User ressource.' })
  @Swagger.ApiOkResponse({ type: () => UserResponse })
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
  @Swagger.ApiOkResponse({ type: () => UserResponse })
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
  @Swagger.ApiOkResponse({ type: () => UserResponse })
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
