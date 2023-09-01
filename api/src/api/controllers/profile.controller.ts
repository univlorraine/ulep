import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { configuration } from 'src/configuration';
import {
  CreateProfileUsecase,
  GetProfileByUserIdUsecase,
  GetProfileUsecase,
  GetProfilesUsecase,
  GetTandemsForProfileUsecase,
} from 'src/core/usecases';
import { CollectionResponse, CurrentUser } from '../decorators';
import { Roles } from '../decorators/roles.decorator';
import {
  CreateProfileRequest,
  ProfileQueryFilter,
  ProfileResponse,
  UserTandemResponse,
} from '../dtos';
import { AuthenticationGuard } from '../guards';

@Controller('profiles')
@Swagger.ApiTags('Profiles')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly createProfileUsecase: CreateProfileUsecase,
    private readonly getProfilesUsecase: GetProfilesUsecase,
    private readonly getProfileByUserIdUsecase: GetProfileByUserIdUsecase,
    private readonly getProfileUsecase: GetProfileUsecase,
    private readonly getTandemsForProfileUsecase: GetTandemsForProfileUsecase,
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({ summary: 'Creates a Profile ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProfileResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @CurrentUser() user: KeycloakUser,
    @Body() body: CreateProfileRequest,
  ): Promise<ProfileResponse> {
    const profile = await this.createProfileUsecase.execute({
      ...body,
      user: user.sub,
    });

    return ProfileResponse.fromDomain(profile);
  }

  @Get()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Profile ressource.',
  })
  @CollectionResponse(ProfileResponse)
  async getCollection(
    @Query() { page, limit, field, order, where }: ProfileQueryFilter,
  ): Promise<Collection<ProfileResponse>> {
    const profiles = await this.getProfilesUsecase.execute({
      page,
      orderBy: {
        field,
        order,
      },
      limit,
      where: where
        ? {
            user: {
              country: { equals: where.user?.country },
              email: { contains: where.user?.email },
              firstname: { contains: where.user?.firstname },
              lastname: { contains: where.user?.lastname },
              role: { equals: where.user?.role },
              university: { equals: where.user?.university },
            },
            masteredLanguageCode: where.masteredLanguageCode,
            nativeLanguageCode: where.nativeLanguageCode,
          }
        : undefined,
    });

    return new Collection<ProfileResponse>({
      items: profiles.items.map(ProfileResponse.fromDomain),
      totalItems: profiles.totalItems,
    });
  }

  @Get(':id/tandems')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Tandem ressource.',
  })
  @Swagger.ApiOkResponse({ type: UserTandemResponse, isArray: true })
  async getTandems(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserTandemResponse[]> {
    const tandems = await this.getTandemsForProfileUsecase.execute({
      profile: id,
    });

    return tandems.map((tandem) => UserTandemResponse.fromDomain(id, tandem));
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({
    summary: 'Retrieve a Profile from user id.',
  })
  @Swagger.ApiOkResponse({ type: ProfileResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItemByUserId(
    @CurrentUser() user: KeycloakUser,
  ): Promise<ProfileResponse> {
    const profile = await this.getProfileByUserIdUsecase.execute({
      id: user.sub,
    });

    return ProfileResponse.fromDomain(profile);
  }

  @Get(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({ summary: 'Retrieve a Profile ressource.' })
  @Swagger.ApiOkResponse({ type: ProfileResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProfileResponse> {
    const profile = await this.getProfileUsecase.execute({ id });

    return ProfileResponse.fromDomain(profile);
  }
}
