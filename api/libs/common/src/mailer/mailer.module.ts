import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import {
  MAILER_CONFIGURATION,
  MailerConfiguration,
  MailerService,
} from './mailer.service';

export interface MailerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useFactory: (
    ...args: any[]
  ) => Promise<MailerConfiguration> | MailerConfiguration;
  inject: any[];
}

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {
  static registerAsync(options: MailerAsyncOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: MailerModule,
      imports: options.imports || [],
      providers: [this.createAsyncConfiguration(options)],
    };
  }

  private static createAsyncConfiguration(
    options: MailerAsyncOptions,
  ): Provider {
    return {
      provide: MAILER_CONFIGURATION,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }
}
