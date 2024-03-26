import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class InMemoryI18nService implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    // Noop
  }
  onModuleDestroy() {
    // Noop
  }

  public translate(key: string, opts: any) {
    return key;
  }

  public hasLanguageBundle(language: string, namespace: string) {
    throw new Error('Not implemented');
  }

  public getLanguageBundle(language: string, namespace: string) {
    throw new Error('Not implemented');
  }
}
