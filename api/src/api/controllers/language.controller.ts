import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { LanguageCodeResponse, LanguageRequestsCountResponse } from '../dtos';
import {
  AddLanguageRequestUsecase,
  FindAllLanguageCodeUsecase,
} from 'src/core/usecases/language';
import { AuthenticationGuard } from '../guards';
import { CurrentUser } from '../decorators';
import { KeycloakUser } from '@app/keycloak';

@Controller('languages')
@Swagger.ApiTags('Languages')
export class LanguageController {
  private readonly logger = new Logger(LanguageController.name);

  constructor(
    private readonly findAllLanguagesUsecase: FindAllLanguageCodeUsecase,
    private readonly addLanguageRequestUsecase: AddLanguageRequestUsecase,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of LanguageCode ressource.' })
  @Swagger.ApiOkResponse({ type: LanguageCodeResponse, isArray: true })
  async findAll() {
    const instances = await this.findAllLanguagesUsecase.execute();

    return instances.map((instance) => new LanguageCodeResponse(instance));
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
