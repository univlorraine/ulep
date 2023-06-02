import Profile from './profile';

export interface ProfileRepository {
  createProfile: (profile: Profile) => Promise<void>;
}
