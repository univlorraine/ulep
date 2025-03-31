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
  LearningLanguageWithTandemWithPartnerLearningLanguage,
  LearningType,
  ProficiencyLevel,
} from 'src/core/models';
import { ProfileWithTandemsProfiles } from 'src/core/models/profileWithTandemsProfiles.model';
import { campusMapper } from './campus.mapper';
import { languageMapper } from './language.mapper';
import { ProfilesRelations } from './profile.mapper';
import { tandemWithPartnerLearningLanguageMapper } from './tandemWithPartnerLearningLanguage.mapper';
import { userMapper, UserRelations, UserSnapshot } from './user.mapper';

export type ProfileWithTandemsProfilesSnapshot = Prisma.Profiles & {
  User: UserSnapshot;
  NativeLanguage: Prisma.LanguageCodes;
  LearningLanguages: (Prisma.LearningLanguages & {
    LanguageCode: Prisma.LanguageCodes;
    Campus: Prisma.Places;
    Tandem: Prisma.Tandems;
  })[];
  MasteredLanguages: (Prisma.MasteredLanguages & {
    LanguageCode: Prisma.LanguageCodes;
  })[];
};

export const ProfilesRelationsWithTandemProfile = {
  User: {
    include: UserRelations,
  },
  NativeLanguage: true,
  MasteredLanguages: { include: { LanguageCode: true } },
  LearningLanguages: {
    include: {
      LanguageCode: true,
      Tandem: {
        include: {
          LearningLanguages: {
            include: {
              Profile: {
                include: ProfilesRelations,
              },
              LanguageCode: true,
              Campus: true,
              TandemLanguage: true,
            },
          },
          UniversityValidations: true,
        },
      },
      Campus: true,
    },
  },
};

export const profileWithTandemsProfilesMapper = (
  instance: ProfileWithTandemsProfilesSnapshot,
): ProfileWithTandemsProfiles => {
  return new ProfileWithTandemsProfiles({
    id: instance.id,
    user: userMapper(instance.User),
    nativeLanguage: languageMapper(instance.NativeLanguage),
    masteredLanguages: instance.MasteredLanguages.map((language) =>
      languageMapper(language.LanguageCode),
    ),
    learningLanguages: instance.LearningLanguages.map(
      (learningLanguage) =>
        new LearningLanguageWithTandemWithPartnerLearningLanguage({
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
          tandem:
            learningLanguage.Tandem &&
            tandemWithPartnerLearningLanguageMapper(
              learningLanguage.Tandem,
              instance.id,
            ),
          certificateOption: learningLanguage.certificate_option,
          specificProgram: learningLanguage.specific_program,
        }),
    ),
    createdAt: instance.created_at,
    updatedAt: instance.updated_at,
  });
};
