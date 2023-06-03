import Profile from './profile';

export interface ProfileRepository {
  save: (profile: Profile) => Promise<void>;
}
