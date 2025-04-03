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
import { MediaObject } from 'src/core/models';
import {
  EditoMandatoryTranslations,
  Instance,
} from 'src/core/models/Instance.model';
import { languageMapper } from './language.mapper';

export type InstanceSnapshot = Prisma.Instance & {
  DefaultCertificateFile: Prisma.MediaObjects;
  EditoCentralUniversityTranslations: Prisma.LanguageCodes[];
};

export const instanceMapper = (instanceSnapshot: InstanceSnapshot) => {
  return new Instance({
    id: instanceSnapshot.id,
    name: instanceSnapshot.name,
    email: instanceSnapshot.email,
    ressourceUrl: instanceSnapshot.ressource_url,
    cguUrl: instanceSnapshot.cgu_url,
    confidentialityUrl: instanceSnapshot.confidentiality_url,
    primaryColor: instanceSnapshot.primary_color,
    primaryBackgroundColor: instanceSnapshot.primary_background_color,
    primaryDarkColor: instanceSnapshot.primary_dark_color,
    secondaryColor: instanceSnapshot.secondary_color,
    secondaryBackgroundColor: instanceSnapshot.secondary_background_color,
    secondaryDarkColor: instanceSnapshot.secondary_dark_color,
    isInMaintenance: instanceSnapshot.is_in_maintenance,
    daysBeforeClosureNotification:
      instanceSnapshot.days_before_closure_notification,
    defaultCertificateFile:
      instanceSnapshot.DefaultCertificateFile &&
      new MediaObject({
        id: instanceSnapshot.DefaultCertificateFile.id,
        name: instanceSnapshot.DefaultCertificateFile.name,
        bucket: instanceSnapshot.DefaultCertificateFile.bucket,
        mimetype: instanceSnapshot.DefaultCertificateFile.mime,
        size: instanceSnapshot.DefaultCertificateFile.size,
      }),
    editoMandatoryTranslations:
      instanceSnapshot.edito_mandatory_translations.map(
        (translation) => translation as EditoMandatoryTranslations,
      ),
    editoCentralUniversityTranslations:
      instanceSnapshot.EditoCentralUniversityTranslations &&
      instanceSnapshot.EditoCentralUniversityTranslations.map((translation) =>
        languageMapper(translation),
      ),
  });
};
