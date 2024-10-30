import * as Prisma from '@prisma/client';
import {
  LearningLanguage,
  LearningType,
  MediaObject,
  MeetingFrequency,
  ProficiencyLevel,
  Profile,
} from 'src/core/models';
import { testedLanguageMapper } from 'src/providers/persistance/mappers/testedLanguage.mapper';
import { campusMapper } from './campus.mapper';
import { customLearningGoalMapper } from './customLearningGoal.mapper';
import { languageMapper } from './language.mapper';
import {
  textContentMapper,
  TextContentRelations,
  TextContentSnapshot,
} from './translation.mapper';
import { userMapper, UserRelations, UserSnapshot } from './user.mapper';

export const ProfilesRelations = {
  User: {
    include: UserRelations,
  },
  Goals: {
    include: { TextContent: TextContentRelations },
  },
  Interests: {
    include: {
      TextContent: TextContentRelations,
      Category: { include: { TextContent: TextContentRelations } },
    },
  },
  NativeLanguage: true,
  MasteredLanguages: { include: { LanguageCode: true } },
  TestedLanguages: {
    include: {
      LanguageCode: true,
    },
  },
  LearningLanguages: {
    include: {
      LanguageCode: true,
      Tandem: true,
      Campus: true,
      CertificateFile: true,
      CustomLearningGoals: true,
    },
  },
  Events: true,
};

export type ProfileSnapshot = Prisma.Profiles & {
  User: UserSnapshot;
  Goals: (Prisma.LearningObjectives & {
    TextContent: TextContentSnapshot;
  })[];
  Interests: (Prisma.Interests & {
    TextContent: TextContentSnapshot;
    Category: Prisma.InterestCategories & { TextContent: TextContentSnapshot };
  })[];
  NativeLanguage: Prisma.LanguageCodes;
  LearningLanguages: (Prisma.LearningLanguages & {
    LanguageCode: Prisma.LanguageCodes;
    Campus: Prisma.Places;
    Tandem: Prisma.Tandems;
    CertificateFile?: Prisma.MediaObjects;
    CustomLearningGoals: Prisma.CustomLearningGoals[];
  })[];
  MasteredLanguages: (Prisma.MasteredLanguages & {
    LanguageCode: Prisma.LanguageCodes;
  })[];
  TestedLanguages: (Prisma.TestedLanguages & {
    LanguageCode: Prisma.LanguageCodes;
  })[];
};

export const profileMapper = (instance: ProfileSnapshot): Profile => {
  const availabilities = JSON.parse(instance.availabilities as string);
  return new Profile({
    id: instance.id,
    user: userMapper(instance.User),
    nativeLanguage: languageMapper(instance.NativeLanguage),
    masteredLanguages: instance.MasteredLanguages.map((language) =>
      languageMapper(language.LanguageCode),
    ),
    testedLanguages: instance.TestedLanguages.map(testedLanguageMapper),
    learningLanguages: instance.LearningLanguages.map(
      (learningLanguage) =>
        new LearningLanguage({
          id: learningLanguage.id,
          createdAt: learningLanguage.created_at,
          updatedAt: learningLanguage.updated_at,
          level: ProficiencyLevel[learningLanguage.level],
          language: languageMapper(learningLanguage.LanguageCode),
          learningType: LearningType[learningLanguage.learning_type],
          sameAge: learningLanguage.same_age,
          sameGender: learningLanguage.same_gender,
          sameTandemEmail: learningLanguage.same_tandem_email,
          hasPriority: learningLanguage.has_priority,
          campus:
            learningLanguage.Campus && campusMapper(learningLanguage.Campus),
          certificateOption: learningLanguage.certificate_option,
          learningJournal: learningLanguage.learning_journal ?? false,
          consultingInterview: learningLanguage.consulting_interview ?? false,
          sharedCertificate: learningLanguage.shared_certificate ?? false,
          certificateFile:
            learningLanguage.CertificateFile &&
            new MediaObject({
              id: learningLanguage.CertificateFile.id,
              name: learningLanguage.CertificateFile.name,
              bucket: learningLanguage.CertificateFile.bucket,
              mimetype: learningLanguage.CertificateFile.mime,
              size: learningLanguage.CertificateFile.size,
            }),
          specificProgram: learningLanguage.specific_program,
          customLearningGoals:
            learningLanguage.CustomLearningGoals &&
            learningLanguage.CustomLearningGoals.map(customLearningGoalMapper),
        }),
    ),
    meetingFrequency: MeetingFrequency[instance.meeting_frequency],
    objectives: instance.Goals.map((objective) => ({
      id: objective.id,
      name: textContentMapper(objective.TextContent),
    })),
    interests: instance.Interests.map((interest) => ({
      id: interest.id,
      name: textContentMapper(interest.TextContent),
      category: interest.category_id,
    })),
    availabilities: {
      monday: availabilities['monday'],
      tuesday: availabilities['tuesday'],
      wednesday: availabilities['wednesday'],
      thursday: availabilities['thursday'],
      friday: availabilities['friday'],
      saturday: availabilities['saturday'],
      sunday: availabilities['sunday'],
    },
    availabilitiesNote: instance.availabilities_note,
    availabilitiesNotePrivacy: instance.availabilities_note_privacy,
    biography: {
      superpower: instance.bio['superpower'],
      favoritePlace: instance.bio['favoritePlace'],
      experience: instance.bio['experience'],
      anecdote: instance.bio['anecdote'],
    },
    createdAt: instance.created_at,
    updatedAt: instance.updated_at,
  });
};
