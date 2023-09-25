import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  Configuration,
  configuration,
  getTranslationsEndpoint,
} from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';

@Controller('instance')
@Swagger.ApiTags('Instance')
export class InstanceController {
  config: Configuration;
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageGateway: StorageInterface,
  ) {
    this.config = configuration();
  }

  @Get('locales/:lng/:type')
  async locales(
    @Param('lng') lng: string,
    @Param('type') type: string,
  ): Promise<string> {
    // %2F work with github and gitlab but / doesn't with gitlab ( ??? )
    const result = await fetch(getTranslationsEndpoint(lng, type), {
      headers: { 'PRIVATE-TOKEN': this.config.translations.token },
    });

    if (!result.ok) {
      throw new RessourceDoesNotExist();
    }

    const locale = await result.json();

    return JSON.stringify(locale);
  }

  // TODO(NOW): type
  @Get('emails/images/:fileName')
  async getEmailImages(
    @Param('fileName') fileName: string,
    @Res() res,
  ): Promise<any> {
    try {
      const stream = await this.storageGateway.getObject('assets', fileName);
      return stream.pipe(res);
    } catch (err) {
      console.error(err);
      if (err.code === 'NoSuchKey') {
        console.log('404');
      }
      // TODO(NOW): return 404 on error
      return;
    }
  }
}
