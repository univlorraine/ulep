/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from 'src/api/decorators';
import { AuthenticationGuard } from 'src/api/guards';
import {
  AddReaderToVocabularyListUsecase,
  CreateVocabularyListUsecase,
  CreateVocabularyUsecase,
  DeleteAudioVocabularyUsecase,
  DeleteVocabularyListUsecase,
  DeleteVocabularyUsecase,
  FindAllVocabularyFromListIdUsecase,
  FindAllVocabularyFromSelectedListsIdUsecase,
  FindAllVocabularyListUsecase,
  GetVocabularyListPdfUsecase,
  RemoveReaderToVocabularyListUsecase,
  UpdateVocabularyListUsecase,
  UpdateVocabularyUsecase,
  UploadAudioVocabularyUsecase,
} from 'src/core/usecases';
import {
  CreateVocabularyListRequest,
  CreateVocabularyRequest,
  GetVocabulariesFromListQuery,
  GetVocabulariesFromSelectedListsQuery,
  GetVocabulariesListQuery,
  UpdateVocabularyListRequest,
  UpdateVocabularyRequest,
  VocabularyListResponse,
  VocabularyResponse,
} from '../dtos';

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
    private readonly findAllVocabularyFromSelectedListsIdUsecase: FindAllVocabularyFromSelectedListsIdUsecase,
    private readonly updateVocabularyUsecase: UpdateVocabularyUsecase,
    private readonly deleteVocabularyUsecase: DeleteVocabularyUsecase,
    private readonly uploadAudioVocabularyUsecase: UploadAudioVocabularyUsecase,
    private readonly deleteAudioVocabularyUsecase: DeleteAudioVocabularyUsecase,
    private readonly getVocabularyListPdfUsecase: GetVocabularyListPdfUsecase,
    private readonly addReaderToVocabularyListUsecase: AddReaderToVocabularyListUsecase,
    private readonly removeReaderToVocabularyListUsecase: RemoveReaderToVocabularyListUsecase,
  ) {}

  @Post('list')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Vocabulary List ressource.' })
  @Swagger.ApiCreatedResponse({ type: () => VocabularyListResponse })
  async createVocabularyList(@Body() body: CreateVocabularyListRequest) {
    const vocabularyList = await this.createVocabularyListUsecase.execute({
      ...body,
    });

    return VocabularyListResponse.from(vocabularyList);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'wordPronunciation', maxCount: 1 },
      { name: 'translationPronunciation', maxCount: 1 },
    ]),
  )
  @Swagger.ApiOperation({ summary: 'Create a new Vocabulary ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiCreatedResponse({ type: () => VocabularyResponse })
  async createVocabulary(
    @Body() body: CreateVocabularyRequest,
    @CurrentUser() user: KeycloakUser,
    @UploadedFiles()
    files?: {
      wordPronunciation?: Express.Multer.File;
      translationPronunciation?: Express.Multer.File;
    },
  ) {
    //TODO: Add Pipe files validators
    const vocabulary = await this.createVocabularyUsecase.execute({
      ...body,
      ownerId: user.sub,
    });
    const { wordPronunciation, translationPronunciation } = files ?? {};

    if (wordPronunciation && wordPronunciation[0]) {
      const audioUrl = await this.uploadAudioVocabularyUsecase.execute({
        file: wordPronunciation[0],
        vocabularyId: vocabulary.id,
        isTranslation: false,
      });

      vocabulary.pronunciationWordUrl = audioUrl;
    }

    if (translationPronunciation && translationPronunciation[0]) {
      const audioUrl = await this.uploadAudioVocabularyUsecase.execute({
        file: translationPronunciation[0],
        vocabularyId: vocabulary.id,
        isTranslation: true,
      });

      vocabulary.pronunciationTranslationUrl = audioUrl;
    }

    return VocabularyResponse.from(vocabulary);
  }

  @Get('pdf/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get a Vocabulary List PDF ressource.' })
  @Swagger.ApiOkResponse({ type: () => VocabularyListResponse })
  async getVocabularyListPdf(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.getVocabularyListPdfUsecase.execute({
      vocabularyListId: id,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=vocabulary-list.pdf',
    );
    res.send(pdfBuffer);
  }

  @Get('list/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get a Vocabulary List ressource.' })
  @Swagger.ApiOkResponse({ type: () => VocabularyListResponse })
  async getVocabularyList(
    @Param('id') id: string,
    @Query() query: GetVocabulariesListQuery,
  ): Promise<Collection<VocabularyListResponse>> {
    const vocabularyLists = await this.findAllVocabularyListUsecase.execute({
      profileId: id,
      languageCode: query.languageCode,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });

    return new Collection<VocabularyListResponse>({
      items: vocabularyLists.map((vocabularyList) =>
        VocabularyListResponse.from(vocabularyList, id),
      ),
      totalItems: vocabularyLists.length,
    });
  }

  @Get('random')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Get Vocabularies ressource in random order.',
  })
  @Swagger.ApiOkResponse({ type: () => VocabularyListResponse })
  async getVocabulariesInRandomOrder(
    @Query() query: GetVocabulariesFromSelectedListsQuery,
  ): Promise<Collection<VocabularyResponse>> {
    const vocabularyLists =
      await this.findAllVocabularyFromSelectedListsIdUsecase.execute({
        vocabularySelectedListsId: query.vocabularySelectedListsId,
        pagination: {
          page: query.page,
          limit: query.limit,
        },
      });

    return new Collection<VocabularyResponse>({
      items: vocabularyLists.map(VocabularyResponse.from),
      totalItems: vocabularyLists.length,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get Vocabularies ressource.' })
  @Swagger.ApiOkResponse({ type: () => VocabularyListResponse })
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

  @Put('list/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Vocabulary List ressource.' })
  @Swagger.ApiCreatedResponse({ type: () => VocabularyListResponse })
  async updateVocabularyList(
    @Param('id') id: string,
    @Body() body: UpdateVocabularyListRequest,
    @CurrentUser() user: KeycloakUser,
  ) {
    const vocabularyList = await this.updateVocabularyListUsecase.execute({
      vocabularyListId: id,
      ...body,
      userId: user.sub,
    });

    return VocabularyListResponse.from(vocabularyList);
  }

  @Post(':id')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'wordPronunciation', maxCount: 1 },
      { name: 'translationPronunciation', maxCount: 1 },
    ]),
  )
  @Swagger.ApiOperation({ summary: 'Update a Vocabulary ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiCreatedResponse({ type: () => VocabularyResponse })
  async updateVocabulary(
    @Param('id') id: string,
    @Body() body: UpdateVocabularyRequest,
    @UploadedFiles()
    files?: {
      wordPronunciation?: Express.Multer.File;
      translationPronunciation?: Express.Multer.File;
    },
  ) {
    const vocabulary = await this.updateVocabularyUsecase.execute({
      vocabularyId: id,
      ...body,
    });

    const { wordPronunciation, translationPronunciation } = files ?? {};

    if (wordPronunciation && wordPronunciation[0]) {
      const url = await this.uploadAudioVocabularyUsecase.execute({
        file: wordPronunciation[0],
        vocabularyId: vocabulary.id,
        isTranslation: false,
      });

      vocabulary.pronunciationWordUrl = url;
    } else if (body.deletePronunciationWord) {
      await this.deleteAudioVocabularyUsecase.execute({
        vocabularyId: vocabulary.id,
        isTranslation: false,
      });
    }

    if (translationPronunciation && translationPronunciation[0]) {
      const url = await this.uploadAudioVocabularyUsecase.execute({
        file: translationPronunciation[0],
        vocabularyId: vocabulary.id,
        isTranslation: true,
      });

      vocabulary.pronunciationTranslationUrl = url;
    } else if (body.deletePronunciationTranslation) {
      await this.deleteAudioVocabularyUsecase.execute({
        vocabularyId: vocabulary.id,
        isTranslation: true,
      });
    }

    return VocabularyResponse.from(vocabulary);
  }

  @Put('list/:id/reader/:profileId')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Add a reader to a Vocabulary List ressource.',
  })
  @Swagger.ApiOkResponse()
  async addReaderToVocabularyList(
    @Param('id') id: string,
    @Param('profileId') profileId: string,
  ) {
    await this.addReaderToVocabularyListUsecase.execute({
      vocabularyListId: id,
      profileId,
    });
  }

  @Delete('list/:id/reader/:profileId')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Remove a reader from a Vocabulary List ressource.',
  })
  @Swagger.ApiOkResponse()
  async removeReaderToVocabularyList(
    @Param('id') id: string,
    @Param('profileId') profileId: string,
  ) {
    await this.removeReaderToVocabularyListUsecase.execute({
      vocabularyListId: id,
      profileId,
    });
  }

  @Delete('list/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Vocabulary List ressource.' })
  @Swagger.ApiOkResponse()
  async deleteVocabularyList(@Param('id') id: string) {
    await this.deleteVocabularyListUsecase.execute({
      vocabularyListId: id,
    });
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Vocabulary ressource.' })
  @Swagger.ApiOkResponse()
  async deleteVocabulary(@Param('id') id: string) {
    await this.deleteVocabularyUsecase.execute({
      vocabularyId: id,
    });
  }
}
