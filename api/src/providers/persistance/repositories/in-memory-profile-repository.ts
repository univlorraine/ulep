import { Collection } from '@app/common';
import {
  MaxTandemsCountAndLanguageProps,
  ProfileRepository,
} from '../../../core/ports/profile.repository';
import { Profile } from '../../../core/models/profile.model';

// TODO: remove #profiles in favor of #profilesMap when possible (Map better suitable
// for inMemory adapter)

export class InMemoryProfileRepository implements ProfileRepository {
  #profiles: Profile[] = [];
  #profilesMap: Map<string, Profile> = new Map();

  init(profiles: Profile[]): void {
    this.#profiles = profiles;
    this.#profilesMap = new Map(
      profiles.map((profile) => [profile.id, profile]),
    );
  }

  reset(): void {
    this.#profiles = [];
    this.#profilesMap = new Map();
  }

  async ofId(id: string): Promise<Profile> {
    return this.#profiles.find((profile) => profile.id === id);
  }

  async ofUser(id: string): Promise<Profile> {
    return this.#profiles.find((profile) => profile.user.id === id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async whereMaxTandemsCount(max: number): Promise<Profile[]> {
    // TODO: add in memory way to add number of tandem per profile
    return Array.from(this.#profilesMap.values());
  }

  async whereMaxTandemsCountAndLanguage(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    props: MaxTandemsCountAndLanguageProps,
  ): Promise<Profile[]> {
    throw new Error('Method not implemented.');
  }

  async create(profile: Profile): Promise<void> {
    this.#profiles.push(profile);
  }

  async update(profile: Profile): Promise<void> {
    const index = this.#profiles.findIndex((p) => p.id === profile.id);
    if (index !== -1) {
      this.#profiles[index] = profile;
    }
  }

  async findAll(offset?: number, limit?: number): Promise<Collection<Profile>> {
    return {
      items: this.#profiles.slice(offset, offset + limit),
      totalItems: this.#profiles.length,
    };
  }

  async delete(profile: Profile): Promise<void> {
    const index = this.#profiles.findIndex((p) => p.id === profile.id);
    if (index !== -1) {
      this.#profiles.splice(index, 1);
    }
  }
}
