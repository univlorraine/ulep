import { Collection } from 'src/shared/types/collection';
import { Profile } from '../models/profile';

export interface ProfileRepository {
  ofId: (id: string) => Promise<Profile | null>;

  ofEmail: (email: string) => Promise<Profile | null>;

  ofLanguage: (languageId: string) => Promise<Profile[]>;

  save: (profile: Profile) => Promise<void>;

  findAll: (offset?: number, limit?: number) => Promise<Collection<Profile>>;

  delete: (profile: Profile) => Promise<void>;
}
