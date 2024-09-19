import { Instance } from 'src/core/models/Instance.model';
import { ModelFactory } from './model.factory';

export class InstanceFactory extends ModelFactory<Instance> {
  getDefaults(): Partial<Instance> {
    return {
      id: '1',
      name: 'test',
      email: 'test@test.com',
      ressourceUrl: 'test',
      cguUrl: 'test',
      confidentialityUrl: 'test',
      primaryColor: 'test',
      primaryBackgroundColor: 'test',
      secondaryColor: 'test',
      secondaryBackgroundColor: 'test',
      primaryDarkColor: 'test',
      secondaryDarkColor: 'test',
      isInMaintenance: false,
      daysBeforeClosureNotification: 8,
    };
  }
}
