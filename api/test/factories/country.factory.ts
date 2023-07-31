import { faker } from '@faker-js/faker';
import { CountryCode } from '../../src/core/models';
import { ModelFactory } from './model.factory';

export class CountryFactory extends ModelFactory<CountryCode> {
  getDefaults(): Partial<CountryCode> {
    return {
      id: faker.string.uuid(),
      code: 'FR',
      name: 'French',
      emoji: '🇫🇷',
      enable: true,
    };
  }
}
