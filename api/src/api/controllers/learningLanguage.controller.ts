import {
  GetLearningLanguagesUsecase,
  GetLearningLanguageOfIdUsecase,
} from 'src/core/usecases/learningLanguage';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Role, Roles } from '../decorators/roles.decorator';
import { AuthenticationGuard } from '../guards';
import { CollectionResponse } from '../decorators';
import {
  GetLearningLanguagesRequest,
  LearningLanguageResponse,
  LearningLanguageWithTandemResponse,
  MatchResponse,
  UserTandemResponse,
} from '../dtos';
import { Collection } from '@app/common';
import { GetLearningLanguageMatchsRequest } from '../dtos/learning-languages/get-learning-language-matches.request';
import { GetLearningLanguageMatchesUsecase } from 'src/core/usecases';
import { GetLearningLanguageTandemUsecase } from 'src/core/usecases/learningLanguage/getLearningLanguageTandem.usecase';
import { DeleteLearningLanguageUsecase } from 'src/core/usecases/learningLanguage/delete-learning-langugage.usecase';

@Controller('learning-languages')
@Swagger.ApiTags('LearningLanguages')
export class LearningLanguageController {
  constructor(
    private getLearningLanguagesUsecase: GetLearningLanguagesUsecase,
    private getLearningLanguageOfIdUsecase: GetLearningLanguageOfIdUsecase,
    private getLearningLanguageMatchesUsecase: GetLearningLanguageMatchesUsecase,
    private getLearningLanguageTandemUseCase: GetLearningLanguageTandemUsecase,
    private deleteLearningLanguageUsecase: DeleteLearningLanguageUsecase,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'learning-language:profile'] })
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Learning languages resource.',
  })
  @CollectionResponse(LearningLanguageWithTandemResponse)
  async getCollection(
    @Query()
    {
      page,
      limit,
      lastname,
      universityIds,
      hasActiveTandem,
      hasActionableTandem,
      hasPausedTandem,
      field,
      order,
    }: GetLearningLanguagesRequest,
  ): Promise<Collection<LearningLanguageWithTandemResponse>> {
    const orderBy = field &&
      order && {
        field,
        order,
      };
    const result = await this.getLearningLanguagesUsecase.execute({
      page,
      limit,
      universityIds,
      orderBy,
      hasActiveTandem,
      hasActionableTandem,
      hasPausedTandem,
      lastname,
    });

    return new Collection<LearningLanguageWithTandemResponse>({
      items: result.items.map((ll) =>
        LearningLanguageWithTandemResponse.fromDomain(ll),
      ),
      totalItems: result.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'learning-language:profile'] })
  @Swagger.ApiOperation({ summary: 'Get a Learning language ressource.' })
  @Swagger.ApiOkResponse({ type: LearningLanguageResponse, isArray: true })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async findLearningLanguageById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LearningLanguageResponse> {
    const learningLanguage = await this.getLearningLanguageOfIdUsecase.execute({
      id,
    });

    return LearningLanguageResponse.fromDomain(learningLanguage);
  }

  @Get(':id/matches')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'learning-language:profile'] })
  @Swagger.ApiOperation({
    summary: "Retrieve learning language's matches",
  })
  @CollectionResponse(MatchResponse)
  async getLearningLangugeMatches(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { count, universityIds }: GetLearningLanguageMatchsRequest,
  ) {
    const matches = await this.getLearningLanguageMatchesUsecase.execute({
      id,
      count,
      universityIds:
        typeof universityIds === 'string' ? [universityIds] : universityIds,
    });

    return new Collection<MatchResponse>({
      items: matches.items.map(MatchResponse.fromDomain),
      totalItems: matches.totalItems,
    });
  }

  @Get(':id/tandems')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'learning-language:profile'] })
  @Swagger.ApiOperation({
    summary: "Retrieve learning language's tandem",
  })
  @CollectionResponse(UserTandemResponse)
  async getLearningLanguageTandem(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserTandemResponse> {
    const learningLanguage = await this.getLearningLanguageOfIdUsecase.execute({
      id,
    });

    const tandem = await this.getLearningLanguageTandemUseCase.execute({
      id,
    });

    return UserTandemResponse.fromDomain(learningLanguage.profile.id, tandem);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a learning language ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteLearningLanguageUsecase.execute({ id });
  }
}
