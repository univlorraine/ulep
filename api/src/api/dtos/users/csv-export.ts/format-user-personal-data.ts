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

import { LearningLanguage, Profile, Role, Tandem, User } from 'src/core/models';
import { UserPersonalData } from 'src/core/usecases';

const userToExportInfos = (user: User) => {
  let info: any = {
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    age: user.age,
    gender: user.gender,
    country: user.country.name,
    university: user.university.name,
    role: user.role,
    division: user.division,
    accepts_email: !!user.acceptsEmail,
    status: user.status,
    user_deactivated: !!user.deactivated,
    deactivated_reason: user.deactivatedReason,
    user_created_at: user.createdAt,
    user_last_update: user.updatedAt,
  };
  if (user.role === Role.STAFF) {
    info = {
      ...info,
      diploma: user.diploma,
    };
  } else if (user.role === Role.STUDENT) {
    info = {
      ...info,
      staff_function: user.staffFunction,
    };
  }
  return info;
};

const profileToExportInfos = (profile: Profile) => ({
  native_language: profile.nativeLanguage,
  mastered_languages: profile.masteredLanguages,
  goals: profile.objectives,
  interests: profile.interests,
  meeting_frequency: profile.meetingFrequency,
  bio_superpower: profile.biography['superpower'],
  bio_favorite_place: profile.biography['favoritePlace'],
  bio_experience: profile.biography['experience'],
  bio_anecdote: profile.biography['anecdote'],
  monday_availabilities: profile.availabilities['monday'],
  tuesday_availabilities: profile.availabilities['tuesday'],
  wednesday_availabilities: profile.availabilities['wednesday'],
  thursday_availabilities: profile.availabilities['thursday'],
  friday_availabilities: profile.availabilities['friday'],
  saturday_availabilities: profile.availabilities['saturday'],
  sunday_availabilities: profile.availabilities['sunday'],
  availabilities_note: profile.availabilitiesNote,
  availabilities_note_is_private: !!profile.availabilitiesNotePrivacy,
  profile_created_at: profile.createdAt,
  profile_last_update: profile.updatedAt,
});

const learningLanguageToExportInfos = (
  learningLanguage: LearningLanguage,
  associatedTandem?: Tandem,
) => {
  return {
    learning_request_language: learningLanguage.language,
    learning_request_level: learningLanguage.level,
    learning_request_type: learningLanguage.learningType,
    learning_request_campus: learningLanguage.campus?.name,
    learning_request_same_gender: !!learningLanguage.sameGender,
    learning_request_same_age: !!learningLanguage.sameAge,
    learning_request_certificate_option: !!learningLanguage.certificateOption,
    learning_request_specific_program: !!learningLanguage.specificProgram,
    learning_request_created_at: learningLanguage.createdAt,
    learning_request_last_update: learningLanguage.updatedAt,
    has_associated_tandem: !!associatedTandem,
    associated_tandem_creation_date: associatedTandem?.createdAt,
  };
};

interface ActiveTandemPerLearningLanguageId {
  [key: string]: Tandem;
}

export const formatUserPersonalData = ({
  user,
  isBlacklisted,
  profile,
  languagesSuggestedByUser,
  activeTandems,
  historizedTandems,
  avatarSignedUrl,
}: UserPersonalData & {
  avatarSignedUrl?: string;
}): any => {
  const activeTandemsInfosPerLearningLanguageId =
    activeTandems.reduce<ActiveTandemPerLearningLanguageId>((acc, tandem) => {
      const currentUserLearningLanguage = tandem.learningLanguages.find(
        (ll) => ll.profile.id === profile.id,
      );
      acc[currentUserLearningLanguage.id] = tandem;
      return acc;
    }, {});

  const baseData = {
    ...userToExportInfos(user),
    avatar: avatarSignedUrl,
    is_blacklisted: !!isBlacklisted,
    ...profileToExportInfos(profile),
    suggested_languages: languagesSuggestedByUser.map((suggestedLanguage) => ({
      code: suggestedLanguage.language.code,
      suggestion_date: suggestedLanguage.createdAt,
    })),
    historized_tandems: historizedTandems.map((historizedTandem) => ({
      code: historizedTandem.language.code,
      historization_date: historizedTandem.createdAt,
    })),
  };

  if (profile.learningLanguages.length > 0) {
    const dataWithLearningLanguages = profile.learningLanguages.map(
      (learningLanguage) => ({
        learning_request_id: learningLanguage.id,
        ...baseData,
        ...learningLanguageToExportInfos(
          learningLanguage,
          activeTandemsInfosPerLearningLanguageId[learningLanguage.id],
        ),
      }),
    );
    return dataWithLearningLanguages;
  } else {
    return [baseData];
  }
};
