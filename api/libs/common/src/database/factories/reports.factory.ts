import { faker } from '@faker-js/faker';
import {
  Report,
  ReportCategory,
  ReportStatus,
} from '../../../../../src/core/models';
import { ModelFactory } from './model.factory';

export class ReportFactory extends ModelFactory<Report> {
  getDefaults(): Partial<Report> {
    return {
      id: faker.string.uuid(),
      status: ReportStatus.OPEN,
      content: faker.lorem.sentence(),
    };
  }
}

export class ReportCategoryFactory extends ModelFactory<ReportCategory> {
  getDefaults(): Partial<ReportCategory> {
    return {
      id: faker.string.uuid(),
      name: {
        id: faker.string.uuid(),
        content: faker.lorem.sentence(),
        language: 'en',
      },
    };
  }
}
