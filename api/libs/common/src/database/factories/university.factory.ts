import { faker } from '@faker-js/faker';
import { University } from '../../../../../src/core/models';
import { ModelFactory } from './model.factory';

export class UniversityFactory extends ModelFactory<University> {
  getDefaults(): Partial<University> {
    return {
      id: faker.string.uuid(),
      name: faker.company.name(),
      campus: [],
      timezone: 'Europe/Paris',
      admissionStart: new Date('2020-01-01'),
      admissionEnd: new Date('2020-12-31'),
      website: faker.internet.url(),
      resourcesUrl: faker.internet.url(),
    };
  }
}
