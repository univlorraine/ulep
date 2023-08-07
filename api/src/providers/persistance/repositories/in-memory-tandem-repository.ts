import { Injectable } from '@nestjs/common';
import { TandemRepository } from '../../../core/ports/tandems.repository';
import { Collection } from '@app/common';
import { Tandem, TandemStatus } from 'src/core/models/tandem.model';

@Injectable()
export class InMemoryTandemRepository implements TandemRepository {
  #tandems: Tandem[] = [];

  init(tandems: Tandem[]): void {
    this.#tandems = tandems;
  }

  reset(): void {
    this.#tandems = [];
  }

  save(tandem: Tandem): Promise<void> {
    this.#tandems.push(tandem);

    return Promise.resolve();
  }

  async hasActiveTandem(profileId: string): Promise<boolean> {
    const activeTandems = this.#tandems.filter(
      (tandem) => tandem.status === TandemStatus.ACTIVE,
    );

    const profileIsInActiveTandem = activeTandems.some((tandem) =>
      tandem.profiles.some((profile) => profile.id === profileId),
    );

    return profileIsInActiveTandem;
  }

  findAllActiveTandems(
    offset?: number,
    limit?: number,
  ): Promise<Collection<Tandem>> {
    const activeTandems = this.#tandems.filter(
      (tandem) => tandem.status === TandemStatus.ACTIVE,
    );

    return Promise.resolve({
      items: activeTandems.slice(offset, offset + limit),
      totalItems: activeTandems.length,
    });
  }
}
