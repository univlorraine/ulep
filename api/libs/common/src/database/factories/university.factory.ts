import { faker } from '@faker-js/faker';
import {
  Language,
  LanguageStatus,
  University,
} from '../../../../../src/core/models';
import { ModelFactory } from './model.factory';

const french = new Language({
  id: faker.string.uuid(),
  code: 'fr',
  name: 'french',
  mainUniversityStatus: LanguageStatus.PRIMARY,
  secondaryUniversityActive: true,
  isDiscovery: false,
});

export class UniversityFactory extends ModelFactory<University> {
  getDefaults(): Partial<University> {
    return {
      id: faker.string.uuid(),
      name: faker.company.name(),
      campus: [],
      timezone: 'Europe/Paris',
      admissionStart: new Date('2020-01-01'),
      admissionEnd: new Date('2020-12-31'),
      maxTandemsPerUser: 1,
      website: faker.internet.url(),
      nativeLanguage: french,
    };
  }
}
