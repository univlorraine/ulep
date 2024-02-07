import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';
import { InstanceResponse } from 'src/api/dtos/instance/instance.response';
import { UpdateInstanceRequest } from 'src/api/dtos/instance/update-instance.request';
import { RessourceDoesNotExist } from 'src/core/errors';
import { GetInstanceUsecase, UpdateInstanceUsecase } from 'src/core/usecases';

@Controller('instance')
@Swagger.ApiTags('Instance')
export class InstanceController {
  constructor(
    private readonly getInstanceUsecase: GetInstanceUsecase,
    private readonly updateInstanceUsecase: UpdateInstanceUsecase,
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

  @Get('locales/:lng/:type')
  async locales(
    @Param('lng') lng: string,
    @Param('type') type: string,
  ): Promise<string> {
    try {
      const translations = await this.i18n.translate(type, { lang: lng });
      return JSON.stringify(translations);
    } catch (error) {
      throw new RessourceDoesNotExist(error.message);
    }
  }
}
