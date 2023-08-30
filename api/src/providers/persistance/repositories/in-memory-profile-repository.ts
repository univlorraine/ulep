import { Collection } from '@app/common';
import {
  GetProfilesUsableForTandemsGenerationProps,
  MaxTandemsCountAndLanguageProps,
  ProfileRepository,
} from '../../../core/ports/profile.repository';
import { Profile } from '../../../core/models/profile.model';
import { Tandem } from 'src/core/models';

export class InMemoryProfileRepository implements ProfileRepository {
  #profiles: Map<string, Profile> = new Map();
  #tandemsPerProfile: Map<string, Tandem[]> = new Map();

  init(profiles: Profile[], tandems?: Tandem[]): void {
    this.#profiles = new Map(profiles.map((profile) => [profile.id, profile]));

    if (tandems) {
      this.#tandemsPerProfile = tandems.reduce((accumulator, value) => {
        const profile1 = value.profiles[0];
        if (accumulator.has(profile1.id)) {
          accumulator.set(profile1.id, [
            ...accumulator.get(profile1.id),
            value,
          ]);
        } else {
          accumulator.set(profile1.id, [value]);
        }

        const profile2 = value.profiles[1];
        if (accumulator.has(profile2.id)) {
          accumulator.set(profile2.id, [
            ...accumulator.get(profile2.id),
            value,
          ]);
        } else {
          accumulator.set(profile2.id, [value]);
        }

        return accumulator;
      }, new Map<string, Tandem[]>());
    }
  }

  reset(): void {
    this.#profiles = new Map();
    this.#tandemsPerProfile = new Map();
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

  async getProfilesUsableForTandemsGeneration(
    props: GetProfilesUsableForTandemsGenerationProps,
  ): Promise<Profile[]> {
    const items = Array.from(this.#profiles.values());
    return items.filter((profile) => {
      const isInUniversities = props.universityIds.includes(
        profile.user.university.id,
      );
      const hasMaxTandems = this.#tandemsPerProfile.has(profile.id)
        ? this.#tandemsPerProfile.get(profile.id).length >=
          props.maxTandemPerProfile
        : false;
      return isInUniversities && !hasMaxTandems;
    });
  }

  async whereMaxTandemsCountAndSpokeLanguage(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    props: MaxTandemsCountAndLanguageProps,
  ): Promise<Profile[]> {
    throw new Error('Method not implemented.');
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
