import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  AllSuggestedLanguageCountResponse,
  LanguageRequestsCountResponse,
  LanguageResponse,
  PaginationDto,
  SuggestedLanguageResponse,
  UpdateLanguageCodeRequest,
} from '../dtos';
import {
  AddLanguageRequestUsecase,
  FindAllLanguageCodeUsecase,
  UpdateLanguageCodeUsecase,
} from 'src/core/usecases/language';
import { AuthenticationGuard } from '../guards';
import { CollectionResponse, CurrentUser } from '../decorators';
import { KeycloakUser } from '@app/keycloak';
import { Collection } from '@app/common';
import { FindAllSuggestedLanguageParams } from 'src/api/dtos/language-code/suggested-language-filters';
import { FindAllSuggestedLanguageUsecase } from 'src/core/usecases/language/find-all-suggested-language.usecase';
import { Role, Roles } from 'src/api/decorators/roles.decorator';
import { CountAllSuggestedLanguageUsecase } from 'src/core/usecases/language/count-all-suggested-language.usecase';
import { FindAllLanguageParams } from 'src/api/dtos/language-code/language-filters';

@Controller('languages')
@Swagger.ApiTags('Languages')
export class LanguageController {
  constructor(
    private readonly countAllSuggestedLanguageUsecase: CountAllSuggestedLanguageUsecase,
    private readonly findAllLanguagesUsecase: FindAllLanguageCodeUsecase,
    private readonly findAllSuggestedLanguageUsecase: FindAllSuggestedLanguageUsecase,
    private readonly addLanguageRequestUsecase: AddLanguageRequestUsecase,
    private readonly updateLangaugeUsecase: UpdateLanguageCodeUsecase,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(LanguageResponse)
  @Swagger.ApiOperation({ summary: 'Collection of LanguageCode ressource.' })
  @Swagger.ApiOkResponse({ type: LanguageResponse, isArray: true })
  async findAll(
    @Query()
    { pagination, limit, page, status, order, field }: FindAllLanguageParams,
  ) {
    const languages = await this.findAllLanguagesUsecase.execute({
      pagination,
      limit,
      page,
      status,
      orderBy: {
        field,
        order,
      },
    });

    return new Collection<LanguageResponse>({
      items: languages.items.map((language) =>
        LanguageResponse.fromLanguage(language),
      ),
      totalItems: languages.totalItems,
    });
  }

  @Put()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(LanguageResponse)
  @SerializeOptions({ groups: ['read', 'language:read'] })
  @Swagger.ApiOperation({ summary: 'Update LanguageCode ressource.' })
  @Swagger.ApiOkResponse({ type: LanguageResponse, isArray: true })
  async update(
    @Body()
    command: UpdateLanguageCodeRequest,
  ) {
    const language = await this.updateLangaugeUsecase.execute(command);

    return LanguageResponse.fromLanguage(language);
  }

  @Get('requests')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(SuggestedLanguageResponse)
  @Swagger.ApiOperation({
    summary: 'Collection of Suggested languages ressource.',
  })
  @Swagger.ApiOkResponse({ type: SuggestedLanguageResponse, isArray: true })
  async findAllRequests(
    @Query() { field, limit, order, page }: FindAllSuggestedLanguageParams,
  ) {
    const suggestedLanguages =
      await this.findAllSuggestedLanguageUsecase.execute({
        orderBy: { order, field },
        limit,
        page,
      });

    return new Collection<SuggestedLanguageResponse>({
      items: suggestedLanguages.items.map(SuggestedLanguageResponse.fromDomain),
      totalItems: suggestedLanguages.totalItems,
    });
  }

  @Get('requests/count')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(AllSuggestedLanguageCountResponse)
  @Swagger.ApiOperation({
    summary: 'Collection of Suggested languages by number ressource.',
  })
  @Swagger.ApiOkResponse({
    type: AllSuggestedLanguageCountResponse,
    isArray: true,
  })
  async countAllSuggestedLanguages(@Query() { limit, page }: PaginationDto) {
    const countSuggestedLanguages =
      await this.countAllSuggestedLanguageUsecase.execute({
        limit,
        page,
      });

    return new Collection<AllSuggestedLanguageCountResponse>({
      items: countSuggestedLanguages.items.map(
        AllSuggestedLanguageCountResponse.fromDomain,
      ),
      totalItems: countSuggestedLanguages.totalItems,
    });
  }

  @Post(':code/requests')
  @SerializeOptions({ groups: ['read'] })
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Add new requests .' })
  @Swagger.ApiCreatedResponse({ type: LanguageRequestsCountResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async addRequest(
    @Param('code') code: string,
    @CurrentUser() user: KeycloakUser,
  ): Promise<LanguageRequestsCountResponse> {
    const count = await this.addLanguageRequestUsecase.execute({
      code,
      userId: user.sub,
    });

    return LanguageRequestsCountResponse.fromDomain(count);
  }
}
