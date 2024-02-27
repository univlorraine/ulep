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
    // %2F work with github and gitlab but / doesn't with gitlab ( ??? )
    const endpoint = this.env.get('TRANSLATIONS_ENDPOINT');
    const suffix = this.env.get('TRANSLATIONS_ENDPOINT_SUFFIX');
    const url = `${endpoint}%2F${lng}%2F${type}.json${suffix || ''}`;

    const headers = new Headers();
    if (this.env.get('TRANSLATIONS_TOKEN')) {
      headers.append('PRIVATE-TOKEN', this.env.get('TRANSLATIONS_TOKEN'));
    } else if (this.env.get('TRANSLATIONS_BEARER_TOKEN')) {
      headers.append(
        'Authorization',
        `Bearer ${this.env.get('TRANSLATIONS_BEARER_TOKEN')}`,
      );
    } else {
      this.logger.debug(
        'No authentication setup to fetch instance translations',
      );
    }

    console.log('url', url);
    console.log('headers', headers);

    const result = await fetch(url, {
      headers,
    });

    if (!result.ok) {
      throw new RessourceDoesNotExist();
    }

    const locale = await result.json();

    return JSON.stringify(locale);
  }
}
