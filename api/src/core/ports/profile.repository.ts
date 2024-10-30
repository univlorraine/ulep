import { Collection, SortOrder, StringFilter } from '@app/common';
import { LearningType, Profile, TandemStatusFilter } from '../models';
import { ProfileWithTandemsProfiles } from '../models/profileWithTandemsProfiles.model';

export const PROFILE_REPOSITORY = 'profile.repository';

export type ProfileQuerySortKey =
  | 'email'
  | 'firstname'
  | 'lastname'
  | 'role'
  | 'university';

export type MaxTandemsCountAndLanguageProps = {
  tandemsCount: number;
  spokenLanguageId: string;
};

export type GetProfilesUsableForTandemsGenerationProps = {
  maxTandemPerProfile: number;
  universityIds: string[];
};

export interface ProfileQueryWhere {
  user?: {
    country?: StringFilter;
    email?: StringFilter;
    firstname?: StringFilter;
    lastname?: StringFilter;
    role?: StringFilter;
    university?: StringFilter;
    status?: StringFilter;
  };
  masteredLanguageCode?: string;
  nativeLanguageCode?: string;
  notSubscribedToEvent?: string;
  subscribedToEvent?: string;
}

export interface ProfileWithTandemsProfilesQueryWhere {
  user: {
    lastname?: string;
    university?: string;
    division?: string;
  };
  learningLanguage?: string;
  learningType?: LearningType;
  tandemStatus?: TandemStatusFilter;
}

export interface ProfileQueryOrderBy {
  field: ProfileQuerySortKey;
  order: SortOrder;
}

export interface ProfileRepository {
  ofId: (id: string) => Promise<Profile | null>;

  ofIdWithTandemsProfiles: (
    id: string,
  ) => Promise<ProfileWithTandemsProfiles | null>;

  ofUser: (userId: string) => Promise<Profile | null>;

  create: (profile: Profile) => Promise<void>;

  update: (profile: Profile) => Promise<Profile>;

  findAll: (
    offset?: number,
    limit?: number,
    orderBy?: ProfileQueryOrderBy,
    where?: ProfileQueryWhere,
  ) => Promise<Collection<Profile>>;

  findAllWithTandemsProfiles: (
    offset?: number,
    limit?: number,
    where?: ProfileWithTandemsProfilesQueryWhere,
  ) => Promise<Collection<ProfileWithTandemsProfiles>>;

  delete: (profile: Profile) => Promise<void>;
}
