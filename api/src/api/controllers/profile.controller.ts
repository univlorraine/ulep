import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Logger,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { GetProfilesUsecase } from 'src/core/usecases/profiles/get-profiles.usecase';
import { GetProfileUsecase } from 'src/core/usecases/profiles/get-profile.usecase';
import { CreateProfileUsecase } from 'src/core/usecases/profiles/create-profile.usecase';
import { User } from '../decorators/user.decorator';
import { KeycloakUserInfoResponse } from '@app/keycloak';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { ProfileResponse } from '../dtos/profiles/profile.response';
import { CreateProfileRequest } from '../dtos/profiles/create-profile.request';
import { PaginationDto } from '../dtos/pagination.dto';
import { Collection } from 'src/shared/types/collection';
import { CollectionResponse } from '../decorators/collection.decorator';
import { UpdateProfileUsecase } from 'src/core/usecases/profiles/update-profile.usecase';
import { UpdateProfileRequest } from '../dtos/profiles/update-profile.request';
import { DeleteProfileUsecase } from 'src/core/usecases/profiles/delete-profile.usecase';

@Controller('profiles')
@Swagger.ApiTags('Profiles')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly getProfilesUsecase: GetProfilesUsecase,
    private readonly getProfileUsecase: GetProfileUsecase,
    private readonly createProfileUsecase: CreateProfileUsecase,
    private readonly updateProfileUsecase: UpdateProfileUsecase,
    private readonly deleteProfileUsecase: DeleteProfileUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Profile ressource.',
  })
  @CollectionResponse(ProfileResponse)
  async getCollection(
    @Query() { page, limit }: PaginationDto,
  ): Promise<Collection<ProfileResponse>> {
    const profiles = await this.getProfilesUsecase.execute({
      page: page,
      limit: limit,
    });

    return new Collection<ProfileResponse>(
      profiles.items.map(ProfileResponse.fromDomain),
      profiles.totalItems,
    );
  }

  @Get(':id')
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
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Creates a Profile ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProfileResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @Body() body: CreateProfileRequest,
    @User() user: KeycloakUserInfoResponse,
  ): Promise<ProfileResponse> {
    const profile = await this.createProfileUsecase.execute({
      id: user.sub,
      email: user.email,
      ...body,
    });

    return ProfileResponse.fromDomain(profile);
  }

  @Patch(':id')
  @Swagger.ApiOperation({ summary: 'Updates a Profile ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProfileResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProfileRequest,
  ) {
    const profile = await this.updateProfileUsecase.execute({
      id,
      ...body,
    });

    return ProfileResponse.fromDomain(profile);
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Removes a Profile ressource.' })
  @Swagger.ApiOkResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteProfileUsecase.execute({ id });
  }
}
