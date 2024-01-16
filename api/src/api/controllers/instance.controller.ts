import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Put,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Swagger from '@nestjs/swagger';
import { InstanceResponse } from 'src/api/dtos/instance/instance.response';
import { UpdateInstanceRequest } from 'src/api/dtos/instance/update-instance.request';
import { Env, getTranslationsEndpoint } from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import { GetInstanceUsecase, UpdateInstanceUsecase } from 'src/core/usecases';
import { Readable } from 'stream';

@Controller('instance')
@Swagger.ApiTags('Instance')
export class InstanceController {
  #translationToken: string;
  #emailAssetsBucket: string;

  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageGateway: StorageInterface,
    private readonly getInstanceUsecase: GetInstanceUsecase,
    private readonly updateInstanceUsecase: UpdateInstanceUsecase,
    env: ConfigService<Env, true>,
  ) {
    this.#translationToken = env.get('TRANSLATIONS_TOKEN');
    this.#emailAssetsBucket = env.get('EMAIL_ASSETS_BUCKET');
  }

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
    const result = await fetch(getTranslationsEndpoint(lng, type), {
      headers: { 'PRIVATE-TOKEN': this.#translationToken },
    });

    if (!result.ok) {
      throw new RessourceDoesNotExist();
    }

    const locale = await result.json();

    return JSON.stringify(locale);
  }

  @Get('emails/images/:fileName')
  async getEmailImages(
    @Param('fileName') fileName: string,
    @Res() res,
  ): Promise<Readable> {
    try {
      const stream = await this.storageGateway.getObject(
        this.#emailAssetsBucket,
        fileName,
      );
      return stream.pipe(res);
    } catch (err) {
      if (err.code === 'NoSuchKey') {
        return res.status(HttpStatus.NOT_FOUND).end();
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
}
