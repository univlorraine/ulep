import { Collection } from '../../shared/types/collection';
import { Profile } from '../models/profile';

export type ProfileFilters = {
  nativeLanguageCode: string;
  learningLanguageCode: string;
};

export interface ProfileRepository {
  ofId: (id: string) => Promise<Profile | null>;

  ofUser: (id: string) => Promise<Profile | null>;

  where: (filters: ProfileFilters) => Promise<Profile[]>;

  save: (profile: Profile) => Promise<void>;

  findAll: (offset?: number, limit?: number) => Promise<Collection<Profile>>;

  delete: (profile: Profile) => Promise<void>;
}
