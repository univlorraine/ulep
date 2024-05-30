import {
    DynamicModule,
    Module,
    ModuleMetadata,
    Provider,
} from '@nestjs/common';
import {
    KEYCLOAK_CONFIGURATION,
    KeycloakConfiguration,
} from './keycloak.configuration';
import { KeycloakClient } from './keycloak.client';

export interface KeycloakAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    isGlobal?: boolean;
    useFactory: (
        ...args: any[]
    ) => Promise<KeycloakConfiguration> | KeycloakConfiguration;
    inject: any[];
}

@Module({
    providers: [KeycloakClient],
    exports: [KeycloakClient],
})
export class KeycloakModule {
    static registerAsync(options: KeycloakAsyncOptions): DynamicModule {
        return {
            global: options.isGlobal,
            module: KeycloakModule,
            imports: options.imports || [],
            providers: [this.createAsyncConfiguration(options)],
        };
    }

    private static createAsyncConfiguration(
        options: KeycloakAsyncOptions,
    ): Provider {
        return {
            provide: KEYCLOAK_CONFIGURATION,
            useFactory: options.useFactory,
            inject: options.inject,
        };
    }
}
