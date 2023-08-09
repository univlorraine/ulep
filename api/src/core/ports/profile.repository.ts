import { Collection, StringFilter } from '@app/common';
import { Profile } from '../models';

export const PROFILE_REPOSITORY = 'profile.repository';

export type MaxTandemsCountAndLanguageProps = {
  tandemsCount: number;
  nativeLanguage: {
    not: string;
  };
};

export interface ProfileRepository {
  ofId: (id: string) => Promise<Profile | null>;

  ofUser: (userId: string) => Promise<Profile | null>;

  whereMaxTandemsCount: (max: number) => Promise<Profile[]>;

  whereMaxTandemsCountAndLanguage: (
    props: MaxTandemsCountAndLanguageProps,
  ) => Promise<Profile[]>;

  create: (profile: Profile) => Promise<void>;

  update: (profile: Profile) => Promise<void>;

  findAll: (
    offset?: number,
    limit?: number,
    where?: { email?: StringFilter },
  ) => Promise<Collection<Profile>>;

  delete: (profile: Profile) => Promise<void>;
}
