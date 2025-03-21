import { Instance, UpdateInstanceProps } from 'src/core/models/Instance.model';

export const INSTANCE_REPOSITORY = 'instance.repository';

export interface InstanceRepository {
  getInstance(): Promise<Instance>;

  update(props: UpdateInstanceProps): Promise<Instance>;
}
