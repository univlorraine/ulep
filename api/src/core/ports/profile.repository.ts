import { Collection, StringFilter } from '@app/common';
import { Profile } from '../models';

export const PROFILE_REPOSITORY = 'profile.repository';

export type ProfileFilters = {
  nativeLanguageCode: {
    equals?: string;
    not?: string;
  };
};

export interface ProfileRepository {
  ofId: (id: string) => Promise<Profile | null>;

  ofUser: (userId: string) => Promise<Profile | null>;

  availableOnly: (filters?: ProfileFilters) => Promise<Profile[]>;

  create: (profile: Profile) => Promise<void>;

  update: (profile: Profile) => Promise<void>;

  findAll: (
    offset?: number,
    limit?: number,
    where?: { email?: StringFilter },
  ) => Promise<Collection<Profile>>;

  delete: (profile: Profile) => Promise<void>;
}
