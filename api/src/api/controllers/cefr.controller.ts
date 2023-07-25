import { Controller, Get, Param } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { CollectionResponse } from '../decorators/collection.decorator';
import { CountryResponse } from '../dtos/countries';
import { GetCEFRTestUsecase } from 'src/core/usecases/administration/get-cefr-test.usecase';
import { GetCEFRQuestionsResponse } from '../dtos/cefr';
import { LevelPipe } from '../validators/levels.validator';
import { CEFRLevel } from 'src/core/models/cefr';

@Controller('cefr')
@Swagger.ApiTags('CEFR')
export class CEFRController {
  constructor(private readonly getCEFRTestUsecase: GetCEFRTestUsecase) {}

  @Get('questions/:level')
  @Swagger.ApiOperation({ summary: 'Find the questions by level' })
  @Swagger.ApiOkResponse({ type: GetCEFRQuestionsResponse, isArray: true })
  @CollectionResponse(CountryResponse)
  async getQuestions(
    @Param('level', LevelPipe) level: string,
  ): Promise<GetCEFRQuestionsResponse[]> {
    const test = await this.getCEFRTestUsecase.execute({
      level: level as CEFRLevel,
    });

    return test.questions.map((question) =>
      GetCEFRQuestionsResponse.fromDomain(question),
    );
  }
}
