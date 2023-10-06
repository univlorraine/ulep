import { Instance } from 'src/core/models/Instance.model';

export const INSTANCE_REPOSITORY = 'instance.repository';

export interface InstanceRepository {
  getInstance(): Promise<Instance>;

  update(instance: Instance): Promise<Instance>;
}
