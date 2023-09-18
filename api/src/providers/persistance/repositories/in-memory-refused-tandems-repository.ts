import { RefusedTandem } from 'src/core/models/refused-tandem.model';
import { RefusedTandemsRepository } from './../../../core/ports/refused-tandems.repository';

export class InMemoryRefusedTandemRepository
  implements RefusedTandemsRepository
{
  #refusedTandems: RefusedTandem[];

  constructor() {
    this.#refusedTandems = [];
  }

  save(item): Promise<void> {
    this.#refusedTandems.push(item);
    return Promise.resolve();
  }
}
