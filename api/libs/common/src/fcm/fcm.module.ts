import {
  FCMConfiguration,
  FCMService,
  FCM_CONFIGURATION,
} from '@app/common/fcm/fcm.service';
import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';

export interface FCMAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useFactory: (...args: any[]) => Promise<FCMConfiguration> | FCMConfiguration;
  inject: any[];
}

@Module({
  providers: [FCMService],
  exports: [FCMService],
})
export class FCMModule {
  static registerAsync(options: FCMAsyncOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: FCMModule,
      imports: options.imports || [],
      providers: [this.createAsyncConfiguration(options)],
    };
  }

  private static createAsyncConfiguration(options: FCMAsyncOptions): Provider {
    return {
      provide: FCM_CONFIGURATION,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }
}
