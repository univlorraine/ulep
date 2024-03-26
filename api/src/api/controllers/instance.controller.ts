import { I18nService } from '@app/common';
import { Body, Controller, Get, Logger, Param, Put } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Swagger from '@nestjs/swagger';
import { InstanceResponse } from 'src/api/dtos/instance/instance.response';
import { UpdateInstanceRequest } from 'src/api/dtos/instance/update-instance.request';
import { Env } from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';
import { GetInstanceUsecase, UpdateInstanceUsecase } from 'src/core/usecases';

@Controller('instance')
@Swagger.ApiTags('Instance')
export class InstanceController {
  private readonly logger = new Logger(InstanceController.name);

  constructor(
    private readonly getInstanceUsecase: GetInstanceUsecase,
    private readonly updateInstanceUsecase: UpdateInstanceUsecase,
    private readonly env: ConfigService<Env, true>,
    private readonly i18n: I18nService,
  ) {}

  @Get('config')
  @Swagger.ApiOperation({ summary: 'Get the instance configuration' })
  @Swagger.ApiCreatedResponse({ type: InstanceResponse })
  async getInstance(): Promise<InstanceResponse> {
    const instance = await this.getInstanceUsecase.execute();

    return InstanceResponse.fromDomain(instance);
  }

  @Put()
  @Swagger.ApiOperation({ summary: 'Update the instance' })
  @Swagger.ApiCreatedResponse({ type: InstanceResponse })
  async updateInstance(
    @Body() body: UpdateInstanceRequest,
  ): Promise<InstanceResponse> {
    const instance = await this.updateInstanceUsecase.execute(body);

    return InstanceResponse.fromDomain(instance);
  }

  @Get('locales/:lng/translation')
  async locales(@Param('lng') lng: string): Promise<string> {
    const appNamespace = this.env.get('APP_TRANSLATION_NAMESPACE') || 'app';

    if (this.i18n.hasLanguageBundle(lng, appNamespace)) {
      const res = this.i18n.getLanguageBundle(lng, appNamespace);
      return JSON.stringify(res);
    }

    throw new RessourceDoesNotExist();
  }
}
