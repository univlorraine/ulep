import { Injectable } from '@nestjs/common';
import { InstanceRepository } from 'src/core/ports/instance.repository';
import { Instance } from 'src/core/models/Instance.model';

@Injectable()
export class InMemoryInstanceRepository implements InstanceRepository {
  #instance: Instance;

  init(instance: Instance): void {
    this.#instance = instance;
  }

  getInstance(): Promise<Instance> {
    return Promise.resolve(this.#instance);
  }
  update(instance: Instance): Promise<Instance> {
    throw new Error('Method not implemented.');
  }
}
