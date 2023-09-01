import { Injectable } from '@nestjs/common';
import { TandemRepository } from '../../../core/ports/tandems.repository';
import { Collection } from '@app/common';
import { FindWhereProps } from '../../../core/ports/tandems.repository';
import { Tandem, TandemStatus } from '../../../core/models';

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

  saveMany(tandems: Tandem[]): Promise<void> {
    for (const tandem of tandems) {
      this.#tandems.push(tandem);
    }

    return Promise.resolve();
  }

  async findWhere(props: FindWhereProps): Promise<Collection<Tandem>> {
    const { status, offset, limit } = props;

    let tandems = this.#tandems;
    if (status) {
      tandems = tandems.filter((tandem) => tandem.status === status);
    }

    if (offset > tandems.length) {
      return { items: [], totalItems: tandems.length };
    }

    return {
      items: tandems.slice(offset, offset + limit),
      totalItems: tandems.length,
    };
  }

  async getExistingTandems(): Promise<Tandem[]> {
    return this.#tandems.filter(
      (tandem) => tandem.status !== TandemStatus.INACTIVE,
    );
  }

  async getTandemsForProfile(profileId: string): Promise<Tandem[]> {
    return this.#tandems.filter((tandem) =>
      tandem.learningLanguages.some(
        (learningLanguage) => learningLanguage.profile?.id === profileId,
      ),
    );
  }
}
