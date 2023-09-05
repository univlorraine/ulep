import { Collection } from '@app/common';
import {
  GetProfilesUsableForTandemsGenerationProps,
  ProfileRepository,
} from '../../../core/ports/profile.repository';
import { Profile } from '../../../core/models/profile.model';

export class InMemoryProfileRepository implements ProfileRepository {
  #profiles: Map<string, Profile> = new Map();

  init(profiles: Profile[]): void {
    this.#profiles = new Map(profiles.map((profile) => [profile.id, profile]));
  }

  reset(): void {
    this.#profiles = new Map();
  }

  async ofId(id: string): Promise<Profile> {
    return this.#profiles.get(id);
  }

  async ofUser(id: string): Promise<Profile> {
    for (const profile of this.#profiles.values()) {
      if (profile.user.id === id) {
        return profile;
      }
    }
  }

  async create(profile: Profile): Promise<void> {
    this.#profiles.set(profile.id, profile);
  }

  async update(profile: Profile): Promise<void> {
    if (this.#profiles.has(profile.id)) {
      this.#profiles.set(profile.id, profile);
    }
  }

  async findAll(offset?: number, limit?: number): Promise<Collection<Profile>> {
    const allItems = Array.from(this.#profiles.values());

    return {
      items: allItems.slice(offset, offset + limit),
      totalItems: allItems.length,
    };
  }

  async delete(profile: Profile): Promise<void> {
    this.#profiles.delete(profile.id);
  }
}
