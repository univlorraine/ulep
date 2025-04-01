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

import { CountryCode } from 'src/core/models/country-code.model';
import { MediaObject } from 'src/core/models/media.model';
import { Campus } from './campus.model';
import { Language, LanguageStatus } from './language.model';
import { LearningType } from './profile.model';

export enum PairingMode {
  MANUAL = 'MANUAL',
  SEMI_AUTOMATIC = 'SEMI_AUTOMATIC',
  AUTOMATIC = 'AUTOMATIC',
}

export interface UniversityProps {
  id: string;
  logo?: MediaObject;
  name: string;
  parent?: string;
  country: CountryCode;
  codes: string[];
  campus: Campus[];
  domains: string[];
  timezone: string;
  admissionStart: Date;
  admissionEnd: Date;
  openServiceDate: Date;
  closeServiceDate: Date;
  website?: string;
  pairingMode?: PairingMode;
  maxTandemsPerUser: number;
  notificationEmail?: string;
  specificLanguagesAvailable?: Language[];
  nativeLanguage: Language;
  defaultContactId?: string;
  defaultCertificateFile?: MediaObject;
}

export class University {
  readonly id: string;

  readonly logo?: MediaObject;

  readonly name: string;

  readonly codes: string[];

  readonly country: CountryCode;

  readonly domains: string[];

  readonly parent?: string;

  readonly campus: Campus[];

  readonly timezone: string;

  readonly admissionStart: Date;

  readonly admissionEnd: Date;

  readonly openServiceDate: Date;

  readonly closeServiceDate: Date;

  readonly website?: string;

  readonly pairingMode: PairingMode;

  readonly maxTandemsPerUser: number;

  readonly notificationEmail?: string;

  readonly specificLanguagesAvailable: Language[];

  readonly nativeLanguage: Language;

  readonly defaultContactId: string;

  readonly defaultCertificateFile?: MediaObject;

  constructor(props: UniversityProps) {
    this.id = props.id;
    this.admissionStart = props.admissionStart;
    this.admissionEnd = props.admissionEnd;
    this.campus = props.campus;
    this.closeServiceDate = props.closeServiceDate;
    this.codes = props.codes;
    this.country = props.country;
    this.domains = props.domains;
    this.logo = props.logo;
    this.maxTandemsPerUser = props.maxTandemsPerUser;
    this.name = props.name;
    this.notificationEmail = props.notificationEmail;
    this.openServiceDate = props.openServiceDate;
    this.pairingMode = props.pairingMode || PairingMode.MANUAL;
    this.parent = props.parent;
    this.specificLanguagesAvailable = props.specificLanguagesAvailable || [];
    this.timezone = props.timezone;
    this.website = props.website;
    this.nativeLanguage = props.nativeLanguage;
    this.defaultContactId = props.defaultContactId;
    this.defaultCertificateFile = props.defaultCertificateFile;
  }

  static create(props: UniversityProps): University {
    return new University({ ...props });
  }

  public isCentralUniversity(): boolean {
    return !this.parent;
  }

  public supportLanguage(
    language: Language,
    learningType?: LearningType,
  ): boolean {
    if (!this.isCentralUniversity() && language.secondaryUniversityActive) {
      return true;
    } else if (
      this.isCentralUniversity() &&
      language.mainUniversityStatus === LanguageStatus.PRIMARY
    ) {
      return true;
    } else if (
      this.isCentralUniversity() &&
      language.mainUniversityStatus === LanguageStatus.SECONDARY &&
      learningType !== LearningType.ETANDEM
    ) {
      return true;
    } else if (
      this.specificLanguagesAvailable.find((l) => l.id === language.id)
    ) {
      return true;
    }

    return false;
  }
}
