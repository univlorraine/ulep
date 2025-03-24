import { Collection } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { GetLearningLanguageMatchesUsecase } from 'src/core/usecases';
import { CountActivitiesUsecase } from 'src/core/usecases/activity/count-activities.usecase';
import {
  GenerateCertificateUsecase,
  GetLearningLanguageOfIdUsecase,
  GetLearningLanguagesUsecase,
  UpdateLearningLanguageUsecase,
} from 'src/core/usecases/learningLanguage';
import { DeleteLearningLanguageUsecase } from 'src/core/usecases/learningLanguage/delete-learning-langugage.usecase';
import { GetLearningLanguageTandemUsecase } from 'src/core/usecases/learningLanguage/getLearningLanguageTandem.usecase';
import { UpdateVisioDurationUsecase } from 'src/core/usecases/learningLanguage/update-visio-duration.usecase';
import { UploadLearningLanguageCertificateUsecase } from 'src/core/usecases/media/upload-learning-language-certificate.usecase';
import { CountVocabulariesUsecase } from 'src/core/usecases/vocabulary/count-vocabularies.usecase';
import { CollectionResponse } from '../decorators';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  GetLearningLanguagesRequest,
  LearningLanguageResponse,
  LearningLanguageWithTandemResponse,
  MatchResponse,
  UserTandemResponse,
} from '../dtos';
import { GenerateCertificateRequest } from '../dtos/learning-languages/generate-certificate.request';
import { GetLearningLanguageMatchsRequest } from '../dtos/learning-languages/get-learning-language-matches.request';
import { UpdateVisioDurationRequest } from '../dtos/learning-languages/update-visio-duration.request';
import { AuthenticationGuard } from '../guards';

@Controller('learning-languages')
@Swagger.ApiTags('LearningLanguages')
export class LearningLanguageController {
  constructor(
    private getLearningLanguagesUsecase: GetLearningLanguagesUsecase,
    private getLearningLanguageOfIdUsecase: GetLearningLanguageOfIdUsecase,
    private getLearningLanguageMatchesUsecase: GetLearningLanguageMatchesUsecase,
    private getLearningLanguageTandemUseCase: GetLearningLanguageTandemUsecase,
    private deleteLearningLanguageUsecase: DeleteLearningLanguageUsecase,
    private updateLearningLanguageUsecase: UpdateLearningLanguageUsecase,
    private generateCertificateUsecase: GenerateCertificateUsecase,
    private uploadLearningLanguageCertificateUsecase: UploadLearningLanguageCertificateUsecase,
    private updateVisioDurationUsecase: UpdateVisioDurationUsecase,
    private countVocabulariesUsecase: CountVocabulariesUsecase,
    private countActivitiesUsecase: CountActivitiesUsecase,
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
      items: result.items.map((learningLanguage) =>
        LearningLanguageWithTandemResponse.fromDomain({ learningLanguage }),
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

    return LearningLanguageResponse.fromDomain({ learningLanguage });
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

  @Put(':id/generate-certificate')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a learning language ressource.' })
  @Swagger.ApiCreatedResponse({ type: LearningLanguageResponse })
  async updateLearningLanguage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: GenerateCertificateRequest,
  ): Promise<LearningLanguageResponse> {
    const certificate = await this.generateCertificateUsecase.execute(id, body);

    await this.uploadLearningLanguageCertificateUsecase.execute({
      id,
      file: certificate.file,
      language: certificate.language,
    });

    const learningLanguage = await this.updateLearningLanguageUsecase.execute(
      id,
      {
        ...body,
      },
    );

    return LearningLanguageResponse.fromDomain({ learningLanguage });
  }

  @Put(':id/update-visio-duration')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Update visio duration learning language ressource.',
  })
  @Swagger.ApiCreatedResponse({ type: LearningLanguageResponse })
  async updateVisioDuration(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateVisioDurationRequest,
  ): Promise<void> {
    await this.updateVisioDurationUsecase.execute({
      learningLanguageId: id,
      roomName: body.roomName,
      partnerTandemId: body.partnerTandemId,
      partnerFirstname: body.partnerFirstname,
      partnerLastname: body.partnerLastname,
    });
  }
}
