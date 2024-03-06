import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { OwnerAllowed } from '../decorators/owner.decorator';
import { stringify } from 'csv-stringify';
import { profileToCsv } from '../dtos/profiles/profile-to-csv';
import { I18nService } from 'nestjs-i18n';

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
    private readonly getUserPersonalData: GetUserPersonalData,
    private readonly i18n: I18nService,
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

  @Post('revoke')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Revoke User sessions.' })
  async rekoveSessions(@CurrentUser() user: KeycloakUser) {
    return this.revokeSessionsUsecase.execute(user.sub);
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

  @Patch(':id')
  @Roles(Role.ADMIN)
  @OwnerAllowed((request) => request.params.id)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Updates a User ressource.' })
  @Swagger.ApiOkResponse({ type: UserResponse })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserRequest,
  ) {
    const user = await this.updateUserUsecase.execute(id, body);
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
    const content = profileToCsv(userData);

    const userLanguage = userData.profile.nativeLanguage.code;
    const csv = stringify(content, {
      header: true,
      cast: {
        boolean: (value) =>
          this.i18n.translate(`api.export.values.${value ? 'true' : 'false'}`, {
            lang: userLanguage,
          }),
        date: (value) => new Intl.DateTimeFormat(userLanguage).format(value),
        string: (value, { header, column }) => {
          if (header) {
            return this.i18n.translate(`api.export.headers.${value}`, {
              lang: userLanguage,
            });
          } else {
            let key: string;
            switch (column) {
              case 'gender':
              case 'role':
              case 'status':
              case 'meeting_frequency':
                key = column;
                break;
              case 'learning_request_type':
                key = 'learningType';
                break;
            }
            if (key) {
              return this.i18n.translate(`api.export.values.${key}.${value}`, {
                lang: userLanguage,
              });
            } else {
              return value;
            }
          }
        },
      },
    });
    return new StreamableFile(csv);
  }
}
