import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  LanguageRequestsCountResponse,
  LanguageResponse,
  SuggestedLanguageResponse,
} from '../dtos';
import {
  AddLanguageRequestUsecase,
  FindAllLanguageCodeUsecase,
} from 'src/core/usecases/language';
import { AuthenticationGuard } from '../guards';
import { CollectionResponse, CurrentUser } from '../decorators';
import { KeycloakUser } from '@app/keycloak';
import { Collection } from '@app/common';
import { FindAllSuggestedLanguageParams } from 'src/api/dtos/language-code/suggested-language-filters';
import { FindAllSuggestedLanguageUsecase } from 'src/core/usecases/language/find-all-suggested-language.usecase';
import { Roles } from 'src/api/decorators/roles.decorator';
import { configuration } from 'src/configuration';

@Controller('languages')
@Swagger.ApiTags('Languages')
export class LanguageController {
  private readonly logger = new Logger(LanguageController.name);

  constructor(
    private readonly findAllLanguagesUsecase: FindAllLanguageCodeUsecase,
    private readonly findAllSuggestedLanguageUsecase: FindAllSuggestedLanguageUsecase,
    private readonly addLanguageRequestUsecase: AddLanguageRequestUsecase,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(LanguageResponse)
  @Swagger.ApiOperation({ summary: 'Collection of LanguageCode ressource.' })
  @Swagger.ApiOkResponse({ type: LanguageResponse, isArray: true })
  async findAll() {
    const languages = await this.findAllLanguagesUsecase.execute();

    return new Collection<LanguageResponse>({
      items: languages.items.map((language) =>
        LanguageResponse.fromLanguage(language),
      ),
      totalItems: languages.totalItems,
    });
  }

  @Get('requests')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(SuggestedLanguageResponse)
  @Swagger.ApiOperation({ summary: 'Collection of LanguageCode ressource.' })
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
      items: suggestedLanguages.items.map((language) =>
        SuggestedLanguageResponse.fromDomain(language),
      ),
      totalItems: suggestedLanguages.totalItems,
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

    return new LanguageRequestsCountResponse(count);
  }
}
