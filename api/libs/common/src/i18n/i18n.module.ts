import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import {
  I18N_SERVICE_CONFIGURATION,
  I18nService,
  I18nServiceConfiguration,
} from './i18n.service';

export interface I18nModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useFactory: (
    ...args: any[]
  ) => Promise<I18nServiceConfiguration> | I18nServiceConfiguration;
  inject: any[];
}

@Module({
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {
  static registerAsync(options: I18nModuleOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: I18nModule,
      imports: options.imports || [],
      providers: [this.createAsyncConfiguration(options)],
    };
  }

  private static createAsyncConfiguration(
    options: I18nModuleOptions,
  ): Provider {
    return {
      provide: I18N_SERVICE_CONFIGURATION,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }
}
