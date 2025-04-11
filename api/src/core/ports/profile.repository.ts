/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
    division?: StringFilter;
  };
  masteredLanguageCode?: string;
  nativeLanguageCode?: string;
  learningLanguageCode?: string;
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

  findAllWithMasteredLanguageAndLearningLanguage: (
    firstLanguageCode: string,
    secondLanguageCode: string,
  ) => Promise<Profile[]>;

  findAllWithTandemsProfiles: (
    offset?: number,
    limit?: number,
    where?: ProfileWithTandemsProfilesQueryWhere,
  ) => Promise<Collection<ProfileWithTandemsProfiles>>;

  delete: (profile: Profile) => Promise<void>;
}
