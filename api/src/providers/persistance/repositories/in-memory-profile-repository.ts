import { Profile } from '../../../core/models/profile';
import { Collection } from '../../../shared/types/collection';
import {
  ProfileFilters,
  ProfileRepository,
} from '../../../core/ports/profile.repository';

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

  async where(filters: ProfileFilters): Promise<Profile[]> {
    return this.#profiles.filter(
      (profile) =>
        profile.nativeLanguage.code === filters.nativeLanguageCode &&
        profile.learningLanguage.code === filters.learningLanguageCode,
    );
  }

  async save(profile: Profile): Promise<void> {
    this.#profiles.push(profile);
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
