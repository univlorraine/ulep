import { Collection, ModeQuery } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  SerializeOptions,
  Headers,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
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
  UpdateProfileUsecase,
} from 'src/core/usecases';
import { CollectionResponse, CurrentUser } from '../decorators';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  CreateProfileRequest,
  ProfileQueryFilter,
  ProfileResponse,
  UserTandemResponse,
  LearningLanguageDto,
  LearningLanguageResponse,
} from '../dtos';
import { AuthenticationGuard } from '../guards';
import { Profile, User } from 'src/core/models';
import { UpdateProfileRequest } from 'src/api/dtos/profiles/update-profile.request';

@Controller('profiles')
@Swagger.ApiTags('Profiles')
export class ProfileController {
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
    private readonly updateProfileUsecase: UpdateProfileUsecase,
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

  @Post('edit/:id')
  @Swagger.ApiOperation({ summary: 'Edit profile ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProfileResponse })
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
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({ summary: 'Retrieve a Profile ressource.' })
  @Swagger.ApiOkResponse({ type: ProfileResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('Language-code') languageCode?: string,
  ): Promise<ProfileResponse> {
    const profile = await this.getProfileUsecase.execute({ id });

    return ProfileResponse.fromDomain(profile, languageCode);
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
