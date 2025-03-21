import { Injectable } from '@nestjs/common';
import { Instance, UpdateInstanceProps } from 'src/core/models/Instance.model';
import { InstanceRepository } from 'src/core/ports/instance.repository';

@Injectable()
export class InMemoryInstanceRepository implements InstanceRepository {
  #instance: Instance;

  init(instance: Instance): void {
    this.#instance = instance;
  }

  getInstance(): Promise<Instance> {
    return Promise.resolve(this.#instance);
  }
  update(props: UpdateInstanceProps): Promise<Instance> {
    throw new Error('Method not implemented.');
  }
}
