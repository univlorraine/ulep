import { Profile } from 'src/core/models/profile';
import { Collection } from 'src/shared/types/collection';
import { ProfileRepository } from '../../../core/ports/profile.repository';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ofLanguage(languageId: string): Promise<Profile[]> {
    throw new Error('Method not implemented.');
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
