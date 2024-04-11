import { faker } from '@faker-js/faker';
import { Language, LanguageStatus } from 'src/core/models';
import { ModelFactory } from './model.factory';

export class LanguageFactory extends ModelFactory<Language> {
  getDefaults(): Partial<Language> {
    return {
      id: faker.string.uuid(),
      code: 'fr',
      name: 'French',
    };
  }
}
