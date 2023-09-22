import { Controller, Get, Param } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  Configuration,
  configuration,
  getTranslationsEndpoint,
} from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';

@Controller('instance')
@Swagger.ApiTags('Instance')
export class InstanceController {
  config: Configuration;
  constructor() {
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
}
