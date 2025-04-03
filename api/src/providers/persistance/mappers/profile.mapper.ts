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
          sharedLogsDate: learningLanguage.shared_logs_date
            ? new Date(learningLanguage.shared_logs_date)
            : undefined,
          sharedLogsForResearchDate:
            learningLanguage.shared_logs_for_research_date
              ? new Date(learningLanguage.shared_logs_for_research_date)
              : undefined,
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
