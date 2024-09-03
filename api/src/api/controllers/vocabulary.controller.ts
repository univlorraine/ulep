import { Collection } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import {
  CreateVocabularyListUsecase,
  CreateVocabularyUsecase,
  DeleteVocabularyListUsecase,
  DeleteVocabularyUsecase,
  FindAllVocabularyFromListIdUsecase,
  FindAllVocabularyListUsecase,
  UpdateVocabularyListUsecase,
  UpdateVocabularyUsecase,
  UploadAudioVocabularyUsecase,
} from 'src/core/usecases';
import {
  CreateVocabularyListRequest,
  CreateVocabularyRequest,
  GetVocabulariesFromListQuery,
  PaginationDto,
  UpdateVocabularyListRequest,
  UpdateVocabularyRequest,
  VocabularyListResponse,
  VocabularyResponse,
} from '../dtos';
import { ImagesFilePipe } from '../validators/images.validator';

@Controller('vocabulary')
@Swagger.ApiTags('Vocabulary')
export class VocabularyController {
  constructor(
    private readonly createVocabularyListUsecase: CreateVocabularyListUsecase,
    private readonly createVocabularyUsecase: CreateVocabularyUsecase,
    private readonly updateVocabularyListUsecase: UpdateVocabularyListUsecase,
    private readonly deleteVocabularyListUsecase: DeleteVocabularyListUsecase,
    private readonly findAllVocabularyListUsecase: FindAllVocabularyListUsecase,
    private readonly findAllVocabularyFromListIdUsecase: FindAllVocabularyFromListIdUsecase,
    private readonly updateVocabularyUsecase: UpdateVocabularyUsecase,
    private readonly deleteVocabularyUsecase: DeleteVocabularyUsecase,
    private readonly uploadAudioVocabularyUsecase: UploadAudioVocabularyUsecase,
  ) {}

  @Post('list')
  @Swagger.ApiOperation({ summary: 'Create a new Vocabulary List ressource.' })
  @Swagger.ApiCreatedResponse({ type: VocabularyListResponse })
  async createVocabularyList(@Body() body: CreateVocabularyListRequest) {
    const vocabularyList = await this.createVocabularyListUsecase.execute({
      ...body,
    });

    return VocabularyListResponse.from(vocabularyList);
  }

  @Post()
  @UseInterceptors(FileInterceptor('pronunciationWord'))
  @UseInterceptors(FileInterceptor('pronunciationTranslation'))
  @Swagger.ApiOperation({ summary: 'Create a new Vocabulary ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiCreatedResponse({ type: VocabularyResponse })
  async createVocabulary(
    @Body() body: CreateVocabularyRequest,
    @UploadedFile(new ImagesFilePipe()) pronunciationWord?: Express.Multer.File,
    @UploadedFile(new ImagesFilePipe())
    pronunciationTranslation?: Express.Multer.File,
  ) {
    let vocabulary = await this.createVocabularyUsecase.execute({ ...body });

    if (pronunciationWord) {
      const audio = await this.uploadAudioVocabularyUsecase.execute({
        file: pronunciationWord,
        vocabularyId: vocabulary.id,
        isTranslation: false,
      });

      vocabulary.pronunciationWord = audio;
    }

    if (pronunciationTranslation) {
      const audio = await this.uploadAudioVocabularyUsecase.execute({
        file: pronunciationTranslation,
        vocabularyId: vocabulary.id,
        isTranslation: true,
      });

      vocabulary.pronunciationTranslation = audio;
    }

    return VocabularyResponse.from(vocabulary);
  }

  @Get('list/:id')
  @Swagger.ApiOperation({ summary: 'Get a Vocabulary List ressource.' })
  @Swagger.ApiOkResponse({ type: VocabularyListResponse })
  async getVocabularyList(
    @Param('id') id: string,
    @Query() query: PaginationDto,
  ): Promise<Collection<VocabularyListResponse>> {
    const vocabularyLists = await this.findAllVocabularyListUsecase.execute({
      profileId: id,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });

    return new Collection<VocabularyListResponse>({
      items: vocabularyLists.map(VocabularyListResponse.from),
      totalItems: vocabularyLists.length,
    });
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Get Vocabularies ressource.' })
  @Swagger.ApiOkResponse({ type: VocabularyListResponse })
  async getVocabularies(
    @Param('id') id: string,
    @Query() query: GetVocabulariesFromListQuery,
  ): Promise<Collection<VocabularyResponse>> {
    const vocabularyLists =
      await this.findAllVocabularyFromListIdUsecase.execute({
        vocabularyListId: id,
        pagination: {
          page: query.page,
          limit: query.limit,
        },
        search: { search: query.search },
      });

    return new Collection<VocabularyResponse>({
      items: vocabularyLists.map(VocabularyResponse.from),
      totalItems: vocabularyLists.length,
    });
  }

  @Put('list')
  @Swagger.ApiOperation({ summary: 'Update a Vocabulary List ressource.' })
  @Swagger.ApiCreatedResponse({ type: VocabularyListResponse })
  async updateVocabularyList(@Body() body: UpdateVocabularyListRequest) {
    const vocabularyList = await this.updateVocabularyListUsecase.execute({
      vocabularyListId: body.id,
      ...body,
    });

    return VocabularyListResponse.from(vocabularyList);
  }

  @Put()
  @UseInterceptors(FileInterceptor('pronunciationWord'))
  @UseInterceptors(FileInterceptor('pronunciationTranslation'))
  @Swagger.ApiOperation({ summary: 'Update a Vocabulary ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiCreatedResponse({ type: VocabularyResponse })
  async updateVocabulary(
    @Body() body: UpdateVocabularyRequest,
    @UploadedFile(new ImagesFilePipe()) pronunciationWord?: Express.Multer.File,
    @UploadedFile(new ImagesFilePipe())
    pronunciationTranslation?: Express.Multer.File,
  ) {
    let vocabulary = await this.updateVocabularyUsecase.execute({
      vocabularyId: body.id,
      ...body,
    });

    if (pronunciationWord) {
      const audio = await this.uploadAudioVocabularyUsecase.execute({
        file: pronunciationWord,
        vocabularyId: vocabulary.id,
        isTranslation: false,
      });

      vocabulary.pronunciationWord = audio;
    }

    if (pronunciationTranslation) {
      const audio = await this.uploadAudioVocabularyUsecase.execute({
        file: pronunciationTranslation,
        vocabularyId: vocabulary.id,
        isTranslation: true,
      });

      vocabulary.pronunciationTranslation = audio;
    }

    return VocabularyResponse.from(vocabulary);
  }

  @Delete('list/:id')
  @Swagger.ApiOperation({ summary: 'Delete a Vocabulary List ressource.' })
  @Swagger.ApiOkResponse()
  async deleteVocabularyList(@Param('id') id: string) {
    await this.deleteVocabularyListUsecase.execute({
      vocabularyListId: id,
    });
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Delete a Vocabulary ressource.' })
  @Swagger.ApiOkResponse()
  async deleteVocabulary(@Param('id') id: string) {
    await this.deleteVocabularyUsecase.execute({
      vocabularyId: id,
    });
  }
}
