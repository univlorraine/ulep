import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Logger,
  SerializeOptions,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  CreateProfileUsecase,
  GetProfileUsecase,
  GetProfilesUsecase,
  GetTandemsForProfileUsecase,
} from 'src/core/usecases';
import { AuthenticationGuard } from '../guards';
import {
  CreateProfileRequest,
  ProfileQueryFilter,
  ProfileResponse,
  UserTandemResponse,
} from '../dtos';
import { Collection } from '@app/common';
import { CollectionResponse, CurrentUser } from '../decorators';
import { KeycloakUser } from '@app/keycloak';
import { configuration } from 'src/configuration';
import { Roles } from '../decorators/roles.decorator';

@Controller('profiles')
@Swagger.ApiTags('Profiles')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly createProfileUsecase: CreateProfileUsecase,
    private readonly getProfilesUsecase: GetProfilesUsecase,
    private readonly getProfileUsecase: GetProfileUsecase,
    private readonly getTandemsForProfileUsecase: GetTandemsForProfileUsecase,
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @UseGuards(AuthenticationGuard)
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
    @Query() { page, limit, email, field, order }: ProfileQueryFilter,
  ): Promise<Collection<ProfileResponse>> {
    const profiles = await this.getProfilesUsecase.execute({
      page: page,
      orderBy: field && order ? { [field]: order } : undefined,
      limit: limit,
      email: {
        equals: email,
      },
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

    return tandems.items.map((tandem) =>
      UserTandemResponse.fromDomain(id, tandem),
    );
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
