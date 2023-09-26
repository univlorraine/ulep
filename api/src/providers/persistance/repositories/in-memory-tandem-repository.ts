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

  async getTandemForLearningLanguage(
    learningLanguageId: string,
  ): Promise<Tandem> {
    return this.#tandems.find((tandem) =>
      tandem.learningLanguages.some(
        (learningLanguage) => learningLanguage.id === learningLanguageId,
      ),
    );
  }

  async getTandemOfLearningLanguages(
    learningLanguageIds: string[],
  ): Promise<Tandem> {
    return this.#tandems.find((tandem) =>
      tandem.learningLanguages.every((learningLanguage) =>
        learningLanguageIds.includes(learningLanguage.id),
      ),
    );
  }

  async deleteTandemNotLinkedToLearningLangues(): Promise<number> {
    const length = this.#tandems.length;
    this.#tandems = this.#tandems.filter((tandem) => {
      return tandem.learningLanguages?.length > 0;
    });
    return Promise.resolve(length - this.#tandems.length);
  }

  async deleteTandemLinkedToLearningLanguages(
    learningLanguageIds: string[],
  ): Promise<number> {
    const length = this.#tandems.length;
    this.#tandems = this.#tandems.filter((tandem) =>
      tandem.learningLanguages.some((ll) =>
        learningLanguageIds.includes(ll.id),
      ),
    );
    return Promise.resolve(length - this.#tandems.length);
  }

  ofId(id: string): Promise<Tandem> {
    return Promise.resolve(this.#tandems.find((tandem) => tandem.id === id));
  }

  update(tandem: Tandem): Promise<void> {
    this.#tandems = this.#tandems.map((t) => (t.id === tandem.id ? tandem : t));
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    this.#tandems = this.#tandems.filter((t) => t.id !== id);
    return Promise.resolve();
  }
}
