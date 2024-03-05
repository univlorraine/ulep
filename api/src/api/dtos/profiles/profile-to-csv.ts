import { Profile } from 'src/core/models';

export const profileToCsv = (
  profile: Profile,
): (string | number | boolean | Date | string[])[][] => {
  const baseData = {
    // User related fields //
    email: profile.user.email,
    firstname: profile.user.firstname,
    lastname: profile.user.lastname,
    age: profile.user.age,
    gender: profile.user.gender,
    role: profile.user.role,
    status: profile.user.status,
    deactivated_reason: profile.user.deactivatedReason,
    accepts_email: profile.user.acceptsEmail.toString(),
    division: profile.user.division,
    diploma: profile.user.diploma,
    staff_function: profile.user.role,
    deactivated: profile.user.deactivated,
    user_created_at: profile.user.createdAt,
    user_last_update: profile.user.updatedAt,
    university: profile.user.university.name,
    nationality: profile.user.country,

    // "Reports", // Les reports fait à son sujet --> SINON
    // Blacklist // OUI --> boolean
    // "SuggestedLanguages", // OUI => code/langage/createdAt
    // Avatar --> URL si possible

    // Tandem history ---> ID des anciens tandems ? ID / date creation + langue apprentisage

    // Profile related fields //
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
    availabilities_note_privacy: profile.availavilitiesNotePrivacy?.toString(),
    profile_created_at: profile.createdAt,
    profile_last_update: profile.updatedAt,
  };

  // Note: export pas possible si user a pas renseigné son profile --> on voit que les profiles dans BO. Que faire ??? OUPS
  // Ok si 1er export JSON pour les tandems et autre 1-n relations

  // TODO(NOW): use cast to tranform array, dates, bool etc

  if (profile.learningLanguages.length > 0) {
    const dataWithLearningLanguages = profile.learningLanguages.map(
      (learningLanguage) => ({
        ...baseData,
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

        // learning_request_tandem_id: learningLanguage.
        // learning_request_Tandem
        // learning_request_TandemLanguage
      }),
    );
    return dataWithLearningLanguages.reduce((acc, value) => {
      if (acc.length === 0) {
        acc.push(Object.keys(value));
      }
      acc.push(
        Object.values(value).map((val) => (val === null ? undefined : val)),
      );
      return acc;
    }, []);
  } else {
    const tmp = [
      Object.keys(baseData),
      Object.values(baseData).map((val) => (val === null ? undefined : val)),
    ];
    console.log('res', tmp);
    return tmp;
  }
};
