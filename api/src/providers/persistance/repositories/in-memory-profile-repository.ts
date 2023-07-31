import { Collection } from '@app/common';
import { ProfileRepository } from '../../../core/ports/profile.repository';
import { Profile } from '../../../core/models/profile.model';

export class InMemoryProfileRepository implements ProfileRepository {
  #profiles: Profile[] = [];

  init(profiles: Profile[]): void {
    this.#profiles = profiles;
  }

  reset(): void {
    this.#profiles = [];
  }

  async ofId(id: string): Promise<Profile> {
    return this.#profiles.find((profile) => profile.id === id);
  }

  async ofUser(id: string): Promise<Profile> {
    return this.#profiles.find((profile) => profile.user.id === id);
  }

  async availableOnly(): Promise<Profile[]> {
    // TODO
    return this.#profiles;
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
