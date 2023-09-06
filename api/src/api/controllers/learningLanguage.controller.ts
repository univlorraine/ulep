import { GetLearningLanguagesUsecase } from './../../core/usecases/learningLanguage/getLearninLanguages.usecase';
import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { AuthenticationGuard } from '../guards';
import { CollectionResponse } from '../decorators';
import { LearningLanguageResponse, PaginationDto } from '../dtos';
import { Collection } from '@app/common';

@Controller('learning-languages')
@Swagger.ApiTags('LearningLanguages')
export class LearningLanguageController {
  private readonly logger = new Logger(LearningLanguageController.name);

  constructor(
    private getLearningLanguagesUsecase: GetLearningLanguagesUsecase,
  ) {}

  @Get()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Learning languages resource.',
  })
  @CollectionResponse(LearningLanguageResponse)
  async getCollection(
    @Query() { page, limit }: PaginationDto,
  ): Promise<Collection<LearningLanguageResponse>> {
    const result = await this.getLearningLanguagesUsecase.execute({
      page,
      limit,
    });

    return new Collection<LearningLanguageResponse>({
      items: result.items.map((ll) => LearningLanguageResponse.fromDomain(ll)),
      totalItems: result.totalItems,
    });
  }
}
