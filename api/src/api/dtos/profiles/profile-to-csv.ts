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
  user_deactivated: user.deactivated?.toString(),
  deactivated_reason: user.deactivatedReason,
  accepts_email: user.acceptsEmail.toString(),
  division: user.division,
  diploma: user.diploma,
  staff_function: user.role,
  user_created_at: user.createdAt,
  user_last_update: user.updatedAt,
  university: user.university.name,
  nationality: user.country,
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
    learning_request_same_gender: learningLanguage.sameGender.toString(),
    learning_request_same_age: learningLanguage.sameAge.toString(),
    learning_request_certificate_option:
      learningLanguage.certificateOption?.toString(),
    learning_request_specific_program:
      learningLanguage.specificProgram?.toString(),
    has_associated_tandem: (!!associatedTandem).toString(),
    associated_tandem_status: associatedTandem?.status,
    associated_tandem_creation_date: associatedTandem?.createdAt,
  };
};

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
  availabilities_note_is_private: profile.availavilitiesNotePrivacy?.toString(),
  profile_created_at: profile.createdAt,
  profile_last_update: profile.updatedAt,
});

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
}): (string | number | boolean | Date | string[])[][] => {
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

  const baseData = {
    ...userToExportInfos(user),
    is_blacklisted: isBlacklisted.toString(),
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
    return [
      Object.keys(dataWithLearningLanguages[0]),
      ...dataWithLearningLanguages.map((data) =>
        Object.values(data).map((val) => (val === null ? undefined : val)),
      ),
    ];
  } else {
    return [
      Object.keys(baseData),
      Object.values(baseData).map((val) => (val === null ? undefined : val)),
    ];
  }

  // TODO(NOW): use cast to tranform array, dates, bool etc
};
