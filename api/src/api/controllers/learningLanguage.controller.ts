import {
  GetLearningLanguagesUsecase,
  GetLearningLanguageOfIdUsecase,
} from 'src/core/usecases/learningLanguage';
import {
  Controller,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { AuthenticationGuard } from '../guards';
import { CollectionResponse } from '../decorators';
import {
  GetLearningLanguagesRequest,
  LearningLanguageResponse,
  MatchResponse,
  UserTandemResponse,
} from '../dtos';
import { Collection } from '@app/common';
import { GetLearningLanguageMatchsRequest } from '../dtos/learning-languages/get-learning-language-matches.request';
import { GetUserMatchUsecase } from 'src/core/usecases';
import { GetLearningLanguageTandemUsecase } from 'src/core/usecases/learningLanguage/getLearningLanguageTandem.usecase';

@Controller('learning-languages')
@Swagger.ApiTags('LearningLanguages')
export class LearningLanguageController {
  private readonly logger = new Logger(LearningLanguageController.name);

  constructor(
    private getLearningLanguagesUsecase: GetLearningLanguagesUsecase,
    private getLearningLanguageOfIdUsecase: GetLearningLanguageOfIdUsecase,
    private getUserMatchUsecase: GetUserMatchUsecase,
    private getLearningLanguageTandemUseCase: GetLearningLanguageTandemUsecase,
  ) {}

  @Get()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Learning languages resource.',
  })
  @CollectionResponse(LearningLanguageResponse)
  async getCollection(
    @Query()
    { page, limit, universityIds }: GetLearningLanguagesRequest,
  ): Promise<Collection<LearningLanguageResponse>> {
    const result = await this.getLearningLanguagesUsecase.execute({
      page,
      limit,
      universityIds,
    });

    // TODO(NOW+1): see if should make profile parametable in repsone

    return new Collection<LearningLanguageResponse>({
      items: result.items.map((ll) =>
        LearningLanguageResponse.fromDomain(ll, true),
      ),
      totalItems: result.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get a Learning language ressource.' })
  @Swagger.ApiOkResponse({ type: LearningLanguageResponse, isArray: true }) // TODO(NOW)
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async findLearningLanguageById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LearningLanguageResponse> {
    const learningLanguage = await this.getLearningLanguageOfIdUsecase.execute({
      id,
    });

    return LearningLanguageResponse.fromDomain(learningLanguage, true);
  }

  @Get(':id/matches')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: "Retrieve learning language's matches",
  })
  @CollectionResponse(MatchResponse)
  async getLearningLangugeMatches(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { count, universityIds }: GetLearningLanguageMatchsRequest,
  ) {
    const matches = await this.getUserMatchUsecase.execute({
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
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
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
}
