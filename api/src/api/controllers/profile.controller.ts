import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Logger,
  SerializeOptions,
  Put,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { GetProfilesUsecase } from '../../core/usecases/profiles/get-profiles.usecase';
import { GetProfileUsecase } from '../../core/usecases/profiles/get-profile.usecase';
import {
  CreateProfileCommand,
  CreateProfileUsecase,
} from '../../core/usecases/profiles/create-profile.usecase';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { ProfileResponse } from '../dtos/profiles/profile.response';
import { CreateProfileRequest } from '../dtos/profiles/create-profile.request';
import { Collection } from '../../shared/types/collection';
import { CollectionResponse } from '../decorators/collection.decorator';
import {
  UpdateProfileCommand,
  UpdateProfileUsecase,
} from '../../core/usecases/profiles/update-profile.usecase';
import { UpdateProfileRequest } from '../dtos/profiles/update-profile.request';
import { DeleteProfileUsecase } from '../../core/usecases/profiles/delete-profile.usecase';
import { UserRole } from 'src/core/models/user';
import { ProfileQueryFilter } from '../dtos/profiles/profiles-filters';
import { Roles } from '../decorators/roles.decorator';
import { UuidProvider } from '../services/uuid-provider';

@Controller('profiles')
@Swagger.ApiTags('Profiles')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly uuidProvider: UuidProvider,
    private readonly getProfilesUsecase: GetProfilesUsecase,
    private readonly getProfileUsecase: GetProfileUsecase,
    private readonly createProfileUsecase: CreateProfileUsecase,
    private readonly updateProfileUsecase: UpdateProfileUsecase,
    private readonly deleteProfileUsecase: DeleteProfileUsecase,
  ) {}

  @Get()
  @Roles([UserRole.USER])
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Profile ressource.',
  })
  @CollectionResponse(ProfileResponse)
  async getCollection(
    @Query() { page, limit, email }: ProfileQueryFilter,
  ): Promise<Collection<ProfileResponse>> {
    const profiles = await this.getProfilesUsecase.execute({
      page: page,
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

  @Get(':id')
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

  @Post()
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Creates a Profile ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProfileResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() body: CreateProfileRequest): Promise<ProfileResponse> {
    const command: CreateProfileCommand = {
      id: this.uuidProvider.generate(),
      ...body,
    };
    const profile = await this.createProfileUsecase.execute(command);

    return ProfileResponse.fromDomain(profile);
  }

  @Put(':id')
  @SerializeOptions({ groups: ['read', 'profile:read'] })
  @Swagger.ApiOperation({ summary: 'Updates a Profile ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProfileResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProfileRequest,
  ) {
    const command: UpdateProfileCommand = {
      id,
      ...body,
    };

    const profile = await this.updateProfileUsecase.execute(command);

    return ProfileResponse.fromDomain(profile);
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Removes a Profile ressource.' })
  @Swagger.ApiOkResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteProfileUsecase.execute({ id });
  }
}
