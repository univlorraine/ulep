import { Collection, ModeQuery } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { UserKeycloakContactInterceptor } from 'src/api/interceptors';
import { Profile } from 'src/core/models';
import { ProfileWithTandemsProfiles } from 'src/core/models/profileWithTandemsProfiles.model';
import {
  CreateLearningLanguageUseCase,
  CreateOrUpdateTestedLanguageUsecase,
  CreateProfileUsecase,
  DeleteAvatarUsecase,
  DeleteProfileUsecase,
  DeleteUserUsecase,
  GetAdministratorUsecase,
  GetLearningLanguageOfProfileUsecase,
  GetProfileByUserIdUsecase,
  GetProfilesUsecase,
  GetProfilesWithTandemsProfilesUsecase,
  GetProfileUsecase,
  GetProfileWithTandemsProfilesUsecase,
  GetTandemsForProfileUsecase,
  UpdateProfileUsecase,
} from 'src/core/usecases';
import { GetSessionsForProfileUsecase } from 'src/core/usecases/session/get-sessions-for-profile.usecase';
import { CollectionResponse, CurrentUser } from '../decorators';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  CreateProfileRequest,
  LearningLanguageDto,
  LearningLanguageResponse,
  ProfileQueryFilter,
  ProfileResponse,
  SessionResponse,
  TestedLanguageProps,
  UpdateProfileRequest,
  UserTandemResponse,
} from '../dtos';
import { ProfileWithTandemsQueryFilter } from '../dtos/profiles/profiles-with-tandems-filters';
import { ProfileWithTandemsProfilesResponse } from '../dtos/profiles/profiles-with-tandems-profiles.response';
import { AuthenticationGuard } from '../guards';

@Controller('profiles')
@Swagger.ApiTags('Profiles')
export class ProfileController {
  constructor(
    private readonly createProfileUsecase: CreateProfileUsecase,
    private readonly getLearningLanguageOfProfileUsecase: GetLearningLanguageOfProfileUsecase,
    private readonly getProfilesUsecase: GetProfilesUsecase,
    private readonly getProfilesWithTandemsProfilesUsecase: GetProfilesWithTandemsProfilesUsecase,
    private readonly getProfileWithTandemsProfilesUsecase: GetProfileWithTandemsProfilesUsecase,
    private readonly getProfileByUserIdUsecase: GetProfileByUserIdUsecase,
    private readonly getProfileUsecase: GetProfileUsecase,
    private readonly deleteProfileUsecase: DeleteProfileUsecase,
    private readonly getTandemsForProfileUsecase: GetTandemsForProfileUsecase,
    private readonly createLearningLanguageUsecase: CreateLearningLanguageUseCase,
    private readonly deleteUserUsecase: DeleteUserUsecase,
    private readonly deleteAvatarUsecase: DeleteAvatarUsecase,
    private readonly updateProfileUsecase: UpdateProfileUsecase,
    private readonly createOrUpdateTestedLanguageUsecase: CreateOrUpdateTestedLanguageUsecase,
    private readonly getAdminUsecase: GetAdministratorUsecase,
    private readonly getSessionsForProfileUsecase: GetSessionsForProfileUsecase,
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({ summary: 'Creates a Profile ressource.' })
  @Swagger.ApiCreatedResponse({ type: () => ProfileResponse })
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

  @Post('edit/:id')
  @Swagger.ApiOperation({ summary: 'Edit profile ressource.' })
  @Swagger.ApiCreatedResponse({ type: () => ProfileResponse })
  async edit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProfileRequest,
  ) {
    const profile = await this.updateProfileUsecase.execute(id, {
      ...body,
      biography: body.biography as unknown as { [key: string]: string },
    });

    return ProfileResponse.fromDomain(profile);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Profile ressource.',
  })
  @CollectionResponse(ProfileResponse)
  async getCollection(
    @Query() query: ProfileQueryFilter,
  ): Promise<Collection<ProfileResponse>> {
    const {
      email,
      firstname,
      lastname,
      role,
      university,
      country,
      status,
      masteredLanguageCode,
      nativeLanguageCode,
      field,
      order,
      page,
      limit,
    } = query;

    const orderBy = field && order && { field, order };

    const profiles = await this.getProfilesUsecase.execute({
      page,
      orderBy: orderBy,
      limit,
      where: {
        user: {
          country: { equals: country },
          email: { contains: email },
          firstname: {
            contains: firstname,
            mode: ModeQuery.INSENSITIVE,
          },
          lastname: {
            contains: lastname,
            mode: ModeQuery.INSENSITIVE,
          },
          role: { equals: role },
          university: { equals: university },
          status: { equals: status },
        },
        masteredLanguageCode: masteredLanguageCode,
        nativeLanguageCode: nativeLanguageCode,
      },
    });

    return new Collection<ProfileResponse>({
      items: profiles.items.map((profile: Profile) =>
        ProfileResponse.fromDomain(profile),
      ),
      totalItems: profiles.totalItems,
    });
  }

  @Get('/with-tandems-profiles')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({
    groups: [
      'read',
      'learning-language:tandem',
      'learning-language:profile',
      'tandem:university-validations',
    ],
  })
  @Swagger.ApiOperation({
    summary:
      'Retrieve the collection of Profile ressource with tandems for each learning language and corresponding profiles.',
  })
  @CollectionResponse(ProfileResponse)
  async getCollectionWithTandems(
    @Query() query: ProfileWithTandemsQueryFilter,
  ): Promise<Collection<ProfileWithTandemsProfilesResponse>> {
    const {
      lastname,
      university,
      learningLanguage,
      division,
      learningType,
      page,
      limit,
      tandemStatus,
    } = query;

    const profiles = await this.getProfilesWithTandemsProfilesUsecase.execute({
      page,
      limit,
      where: {
        user: {
          lastname: lastname,
          university: university,
          division: division,
        },
        learningLanguage: learningLanguage,
        learningType: learningType,
        tandemStatus: tandemStatus,
      },
    });

    return new Collection<ProfileWithTandemsProfilesResponse>({
      items: profiles.items.map((profile: ProfileWithTandemsProfiles) =>
        ProfileWithTandemsProfilesResponse.fromDomain(profile),
      ),
      totalItems: profiles.totalItems,
    });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Delete a profile resource',
  })
  @CollectionResponse(ProfileResponse)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const profile = await this.getItem(id);
    await this.deleteProfileUsecase.execute({ id });

    const admin = await this.getAdminUsecase.execute(profile.user.id);

    if (admin.groups.length === 0) {
      await this.deleteAvatarUsecase.execute({ userId: profile.user.id });
    }

    await this.deleteUserUsecase.execute({
      id: profile.user.id,
      shouldKeepKeycloakUser: admin.groups.length !== 0,
    });

    return;
  }

  @Get(':id/tandems')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'learning-language:profile'] })
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Tandem ressource.',
  })
  @Swagger.ApiOkResponse({ type: () => UserTandemResponse, isArray: true })
  async getTandems(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('Language-code') languageCode?: string,
  ): Promise<UserTandemResponse[]> {
    const tandems = await this.getTandemsForProfileUsecase.execute({
      profile: id,
    });

    return tandems.map((tandem) =>
      UserTandemResponse.fromDomain(id, tandem, languageCode),
    );
  }

  @Get(':id/sessions')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'learning-language:profile'] })
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Session ressource.',
  })
  @Swagger.ApiOkResponse({ type: () => SessionResponse, isArray: true })
  async getSessions(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SessionResponse[]> {
    const sessions = await this.getSessionsForProfileUsecase.execute({
      profileId: id,
    });

    return sessions.map((tandem) => SessionResponse.from(tandem));
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({
    summary: 'Retrieve a Profile from user id.',
  })
  @Swagger.ApiOkResponse({ type: () => ProfileResponse })
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
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(UserKeycloakContactInterceptor)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({ summary: 'Retrieve a Profile ressource.' })
  @Swagger.ApiOkResponse({ type: () => ProfileResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('Language-code') languageCode?: string,
  ): Promise<ProfileResponse> {
    const profile = await this.getProfileUsecase.execute({ id });

    return ProfileResponse.fromDomain(profile, languageCode);
  }

  @Get('/with-tandems-profiles/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({
    groups: [
      'read',
      'learning-language:tandem',
      'learning-language:profile',
      'tandem:university-validations',
    ],
  })
  @Swagger.ApiOperation({
    summary: 'Retrieve a Profile with tandems and associated profiles.',
  })
  @CollectionResponse(ProfileWithTandemsProfilesResponse)
  async getProfileWithTandemsProfiles(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProfileWithTandemsProfilesResponse> {
    const profile = await this.getProfileWithTandemsProfilesUsecase.execute({
      id,
    });

    return ProfileWithTandemsProfilesResponse.fromDomain(profile);
  }

  @Post(':id/learning-language')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({ summary: 'Add a learning languages to a Profile' })
  @Swagger.ApiOkResponse({ type: () => LearningLanguageResponse })
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
  @SerializeOptions({ groups: ['read', 'learning-language:profile'] })
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of learning languages ressource.',
  })
  @Swagger.ApiOkResponse({
    type: () => LearningLanguageResponse,
    isArray: true,
  })
  @Swagger.ApiNotFoundResponse({ description: 'Resource does not exist' })
  async getLearningLanguage(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LearningLanguageResponse[]> {
    const languages = await this.getLearningLanguageOfProfileUsecase.execute({
      id,
    });

    return languages.map((language) =>
      LearningLanguageResponse.fromDomain(language),
    );
  }

  @Post(':id/tested-language')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Create or update a tested language',
  })
  @Swagger.ApiOkResponse({ type: () => ProfileResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource does not exist' })
  async createOrUpdateTestedLanguage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: TestedLanguageProps,
  ): Promise<ProfileResponse> {
    const profile = await this.createOrUpdateTestedLanguageUsecase.execute({
      ...body,
      profileId: id,
    });

    return ProfileResponse.fromDomain(profile);
  }
}
