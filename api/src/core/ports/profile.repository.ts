import { StringFilter } from 'src/shared/types/filters';
import { Collection } from '../../shared/types/collection';
import { Profile } from '../models/profile';

export type ProfileFilters = {
  nativeLanguageCode: {
    equals?: string;
    not?: string;
  };
};

export interface ProfileRepository {
  ofId: (id: string) => Promise<Profile | null>;

  ofUser: (id: string) => Promise<Profile | null>;

  availableProfiles: (filters?: ProfileFilters) => Promise<Profile[]>;

  create: (profile: Profile) => Promise<void>;

  update: (profile: Profile) => Promise<void>;

  findAll: (
    offset?: number,
    limit?: number,
    where?: { email?: StringFilter },
  ) => Promise<Collection<Profile>>;

  delete: (profile: Profile) => Promise<void>;
}
