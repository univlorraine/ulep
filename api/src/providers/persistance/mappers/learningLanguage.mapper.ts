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
  LearningLanguageWithTandem,
  LearningType,
  MediaObject,
  ProficiencyLevel,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import { campusMapper } from './campus.mapper';
import { customLearningGoalMapper } from './customLearningGoal.mapper';
import { languageMapper } from './language.mapper';
import { profileMapper, ProfileSnapshot } from './profile.mapper';
import { TextContentRelations } from './translation.mapper';
import { UserRelations } from './user.mapper';

export const LearningLanguageRelations = {
  Profile: {
    include: {
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
    },
  },
  LanguageCode: true,
  Campus: true,
  TandemLanguage: true,
  CertificateFile: true,
  CustomLearningGoals: true,
};

export type LearningLanguageSnapshot = Prisma.LearningLanguages & {
  Profile: ProfileSnapshot;
  LanguageCode: Prisma.LanguageCodes;
  Campus: Prisma.Places;
  TandemLanguage?: Prisma.LanguageCodes;
  CertificateFile?: Prisma.MediaObjects;
  CustomLearningGoals: Prisma.CustomLearningGoals[];
};

export const learningLanguageMapper = (
  instance: LearningLanguageSnapshot,
): LearningLanguage => {
  return new LearningLanguage({
    id: instance.id,
    language: languageMapper(instance.LanguageCode),
    level: ProficiencyLevel[instance.level],
    profile: profileMapper(instance.Profile),
    createdAt: instance.created_at,
    updatedAt: instance.updated_at,
    learningType: LearningType[instance.learning_type],
    sameAge: Boolean(instance.same_age),
    sameGender: Boolean(instance.same_gender),
    sameTandemEmail: instance.same_tandem_email,
    campus: instance.Campus && campusMapper(instance.Campus),
    certificateOption: Boolean(instance.certificate_option),
    specificProgram: Boolean(instance.specific_program),
    hasPriority: Boolean(instance.has_priority),
    visioDuration: Number(instance.visio_duration),
    learningJournal: instance.learning_journal ?? false,
    consultingInterview: instance.consulting_interview ?? false,
    sharedCertificate: instance.shared_certificate ?? false,
    sharedLogsDate: instance.shared_logs_date
      ? new Date(instance.shared_logs_date)
      : undefined,
    sharedLogsForResearchDate: instance.shared_logs_for_research_date
      ? new Date(instance.shared_logs_for_research_date)
      : undefined,
    certificateFile:
      instance.CertificateFile &&
      new MediaObject({
        id: instance.CertificateFile.id,
        name: instance.CertificateFile.name,
        bucket: instance.CertificateFile.bucket,
        mimetype: instance.CertificateFile.mime,
        size: instance.CertificateFile.size,
      }),
    tandemLanguage:
      instance.TandemLanguage && languageMapper(instance.TandemLanguage),
    customLearningGoals:
      instance.CustomLearningGoals &&
      instance.CustomLearningGoals.map(customLearningGoalMapper),
  });
};

export const LearningLanguageWithTandemRelations = {
  ...LearningLanguageRelations,
  Tandem: true,
  TandemLanguage: true,
};

export type LearningLanguageWithTandemSnapshot = LearningLanguageSnapshot & {
  Tandem: Prisma.Tandems;
  TandemLanguage?: Prisma.LanguageCodes;
};

export const learningLanguageWithTandemMapper = (
  instance: LearningLanguageWithTandemSnapshot,
): LearningLanguageWithTandem => {
  return new LearningLanguageWithTandem({
    ...learningLanguageMapper(instance),
    tandem:
      instance.Tandem &&
      new Tandem({
        id: instance.Tandem.id,
        status: TandemStatus[instance.Tandem.status],
        compatibilityScore: instance.Tandem.compatibilityScore / 100,
        learningType: LearningType[instance.Tandem.learning_type],
      }),
  });
};
