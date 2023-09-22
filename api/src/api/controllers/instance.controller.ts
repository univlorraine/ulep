import { Controller, Get, Param } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Configuration, configuration } from 'src/configuration';
import { UnsuportedLanguageException } from 'src/core/errors';

@Controller('instance')
@Swagger.ApiExcludeController()
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
    const result = await fetch(
      `${this.config.translationEndpoint}%2F${lng}%2F${type}.json${this.config.translationEndpointSuffix}`,
      { headers: { 'PRIVATE-TOKEN': this.config.translationToken } },
    );

    if (!result.ok) {
      throw new UnsuportedLanguageException(
        `${lng} is not supported from type: ${type}`,
      );
    }

    const locale = await result.json();

    return JSON.stringify(locale);
  }
}
