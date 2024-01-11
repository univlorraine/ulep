import { Collection, ModeQuery } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
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
  CreateLearningLanguageUseCase,
  DeleteProfileUsecase,
  DeleteUserUsecase,
  DeleteAvatarUsecase,
  GetLearningLanguageOfProfileUsecase,
} from 'src/core/usecases';
import { CollectionResponse, CurrentUser } from '../decorators';
import { Roles } from '../decorators/roles.decorator';
import {
  CreateProfileRequest,
  ProfileQueryFilter,
  ProfileResponse,
  UserTandemResponse,
  LearningLanguageDto,
  LearningLanguageResponse,
} from '../dtos';
import { AuthenticationGuard } from '../guards';

@Controller('profiles')
@Swagger.ApiTags('Profiles')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly createProfileUsecase: CreateProfileUsecase,
    private readonly getLearningLanguageOfProfileUsecase: GetLearningLanguageOfProfileUsecase,
    private readonly getProfilesUsecase: GetProfilesUsecase,
    private readonly getProfileByUserIdUsecase: GetProfileByUserIdUsecase,
    private readonly getProfileUsecase: GetProfileUsecase,
    private readonly deleteProfileUsecase: DeleteProfileUsecase,
    private readonly getTandemsForProfileUsecase: GetTandemsForProfileUsecase,
    private readonly createLearningLanguageUsecase: CreateLearningLanguageUseCase,
    private readonly deleteUserUsecase: DeleteUserUsecase,
    private readonly deleteAvatarUsecase: DeleteAvatarUsecase,
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
              firstname: {
                contains: where.user?.firstname,
                mode: ModeQuery.INSENSITIVE,
              },
              lastname: {
                contains: where.user?.lastname,
                mode: ModeQuery.INSENSITIVE,
              },
              role: { equals: where.user?.role },
              university: { equals: where?.user?.university },
              status: { equals: where.user?.status },
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

  @Delete(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Delete a profile resource',
  })
  @CollectionResponse(ProfileResponse)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const profile = await this.getItem(id);
    await this.deleteProfileUsecase.execute({ id });
    await this.deleteAvatarUsecase.execute({ userId: profile.user.id });
    await this.deleteUserUsecase.execute({ id: profile.user.id });

    return;
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

  @Post(':id/learning-language')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({ summary: 'Add a learning languages to a Profile' })
  @Swagger.ApiOkResponse({ type: LearningLanguageResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async addLearningLanguage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: LearningLanguageDto,
  ): Promise<LearningLanguageResponse> {
    const learningLanguage = await this.createLearningLanguageUsecase.execute({
      ...body,
      profileId: id,
    });

    return LearningLanguageResponse.fromDomain(learningLanguage);
  }

  @Get(':id/learning-language')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of learning languages ressource.',
  })
  @Swagger.ApiOkResponse({ type: LearningLanguageResponse, isArray: true })
  @Swagger.ApiNotFoundResponse({ description: 'Resource does not exist' })
  async getLearningLanguage(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LearningLanguageResponse[]> {
    const languages = await this.getLearningLanguageOfProfileUsecase.execute({
      id,
    });

    return languages.map((language) =>
      LearningLanguageResponse.fromDomain(language, false),
    );
  }
}
