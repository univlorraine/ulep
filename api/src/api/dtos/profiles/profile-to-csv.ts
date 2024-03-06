import {
  LearningLanguage,
  Profile,
  SuggestedLanguage,
  Tandem,
  User,
} from 'src/core/models';
import { HistorizedTandem } from 'src/core/models/historized-tandem.model';

const userToExportInfos = (user: User) => ({
  email: user.email,
  firstname: user.firstname,
  lastname: user.lastname,
  age: user.age,
  gender: user.gender,
  role: user.role,
  status: user.status,
  user_deactivated: !!user.deactivated,
  deactivated_reason: user.deactivatedReason,
  accepts_email: !!user.acceptsEmail,
  division: user.division,
  diploma: user.diploma,
  staff_function: user.staffFunction,
  user_created_at: user.createdAt,
  user_last_update: user.updatedAt,
  university: user.university.name,
  nationality: user.country,
});

const profileToExportInfos = (profile: Profile) => ({
  native_language: profile.nativeLanguage.code,
  mastered_languages: profile.masteredLanguages.map(
    (language) => language.code,
  ),
  goals: profile.objectives.map((objective) => objective.name.content),
  interests: profile.interests.map((interest) => interest.name.content),
  meeting_frequency: profile.meetingFrequency,
  bio: JSON.stringify(profile.biography),
  availabilities: JSON.stringify(profile.availabilities),
  availabilities_note: profile.availabilitiesNote,
  availabilities_note_is_private: !!profile.availavilitiesNotePrivacy,
  profile_created_at: profile.createdAt,
  profile_last_update: profile.updatedAt,
});

const learningLanguageToExportInfos = (
  learningLanguage: LearningLanguage,
  associatedTandem?: Tandem,
) => {
  return {
    learning_request_created_at: learningLanguage.createdAt,
    learning_request_last_update: learningLanguage.updatedAt,
    learning_request_language: learningLanguage.language.code,
    learning_request_level: learningLanguage.level,
    learning_request_type: learningLanguage.learningType,
    learning_request_campus: learningLanguage.campus?.name,
    learning_request_same_gender: !!learningLanguage.sameGender,
    learning_request_same_age: !!learningLanguage.sameAge,
    learning_request_certificate_option: !!learningLanguage.certificateOption,
    learning_request_specific_program: !!learningLanguage.specificProgram,
    has_associated_tandem: !!associatedTandem,
    associated_tandem_creation_date: associatedTandem?.createdAt,
  };
};

interface ActiveTandemPerLearningLanguageId {
  [key: string]: Tandem;
}

export const profileToCsv = ({
  user,
  isBlacklisted,
  profile,
  languagesSuggestedByUser,
  activeTandems,
  historizedTandems,
}: {
  user: User;
  isBlacklisted: boolean;
  profile: Profile;
  languagesSuggestedByUser: SuggestedLanguage[];
  activeTandems: Tandem[];
  historizedTandems: HistorizedTandem[];
}): any => {
  console.log('AVATAR', user.avatar);

  // }): (string | number | boolean | Date | string[])[][] => {
  const activeTandemsInfosPerLearningLanguageId =
    activeTandems.reduce<ActiveTandemPerLearningLanguageId>((acc, tandem) => {
      const currentUserLearningLanguage = tandem.learningLanguages.find(
        (ll) => ll.profile.id === profile.id,
      );
      acc[currentUserLearningLanguage.id] = tandem;
      return acc;
    }, {});

  // TODO(NOW): test historized tandems --> ID des anciens tandems ? ID / date creation + langue apprentisage
  // TODO(NOW): Ajouter avatar (URL) si possible
  // TODO(NOW): check only ACTIVE TANDEMS
  // TODO(NOW): translate availabilities / bio
  // TODO(NOW): staffFunction / degree only if staff / student
  // TODO(NOW): translate dynamic values
  // TODO(NOW): translate languages names

  const baseData = {
    ...userToExportInfos(user),
    is_blacklisted: !!isBlacklisted,
    suggested_languages: languagesSuggestedByUser.map((suggestedLanguage) =>
      JSON.stringify({
        code: suggestedLanguage.language.code,
        suggestion_date: suggestedLanguage.createdAt,
      }),
    ),
    nb_previous_tandems: historizedTandems.length,
    ...profileToExportInfos(profile),
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
    return baseData;
  }

  // TODO(NOW): use cast to tranform array, dates, bool etc
};
