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

import { MediaObject } from 'src/core/models/media.model';
import { Language } from './language.model';

export enum EditoMandatoryTranslations {
  CentralUniversityLanguage = 'CentralUniversityLanguage',
  PartnerUniversityLanguage = 'PartnerUniversityLanguage',
  English = 'English',
}

export type UpdateInstanceProps = {
  id: string;
  name?: string;
  email?: string;
  ressourceUrl?: string;
  cguUrl?: string;
  confidentialityUrl?: string;
  primaryColor?: string;
  primaryBackgroundColor?: string;
  primaryDarkColor?: string;
  secondaryColor?: string;
  secondaryBackgroundColor?: string;
  secondaryDarkColor?: string;
  isInMaintenance?: boolean;
  daysBeforeClosureNotification?: number;
  editoMandatoryTranslations?: string[];
  editoCentralUniversityTranslations?: string[];
};

interface InstanceProps {
  id: string;
  name: string;
  email: string;
  ressourceUrl: string;
  cguUrl: string;
  confidentialityUrl: string;
  primaryColor: string;
  primaryBackgroundColor: string;
  primaryDarkColor: string;
  secondaryColor: string;
  secondaryBackgroundColor: string;
  secondaryDarkColor: string;
  isInMaintenance: boolean;
  daysBeforeClosureNotification: number;
  defaultCertificateFile?: MediaObject;
  editoMandatoryTranslations: EditoMandatoryTranslations[];
  editoCentralUniversityTranslations: Language[];
}

export class Instance {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly ressourceUrl: string;
  readonly cguUrl: string;
  readonly confidentialityUrl: string;
  readonly primaryColor: string;
  readonly primaryBackgroundColor: string;
  readonly primaryDarkColor: string;
  readonly secondaryColor: string;
  readonly secondaryBackgroundColor: string;
  readonly secondaryDarkColor: string;
  readonly isInMaintenance: boolean;
  readonly daysBeforeClosureNotification: number;
  readonly defaultCertificateFile?: MediaObject;
  logoURL: string;
  editoMandatoryTranslations: EditoMandatoryTranslations[];
  editoCentralUniversityTranslations: Language[];

  constructor(instance: InstanceProps) {
    this.id = instance.id;
    this.name = instance.name;
    this.email = instance.email;
    this.ressourceUrl = instance.ressourceUrl;
    this.cguUrl = instance.cguUrl;
    this.confidentialityUrl = instance.confidentialityUrl;
    this.primaryColor = instance.primaryColor;
    this.primaryBackgroundColor = instance.primaryBackgroundColor;
    this.primaryDarkColor = instance.primaryDarkColor;
    this.secondaryColor = instance.secondaryColor;
    this.secondaryBackgroundColor = instance.secondaryBackgroundColor;
    this.secondaryDarkColor = instance.secondaryDarkColor;
    this.isInMaintenance = instance.isInMaintenance;
    this.daysBeforeClosureNotification = instance.daysBeforeClosureNotification;
    this.defaultCertificateFile = instance.defaultCertificateFile;
    this.editoMandatoryTranslations = instance.editoMandatoryTranslations;
    this.editoCentralUniversityTranslations =
      instance.editoCentralUniversityTranslations;
  }
}
