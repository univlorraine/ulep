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

import { KeycloakGroup } from '@app/keycloak';
import { CountryCode } from './country-code.model';
import Device from './device.model';
import { Language } from './language.model';
import { MediaObject } from './media.model';
import { University } from './university.model';

export enum AdminGroup {
  SUPER_ADMIN = 'Administrator',
  ANIMATOR = 'Animator',
  MANAGER = 'Manager',
}

export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super-admin',
  ANIMATOR = 'animator',
  MANAGER = 'manager',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  REPORTED = 'REPORTED',
  CANCELED = 'CANCELED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Role {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
}

export type UserProps = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  gender: Gender;
  age: number;
  university: University;
  role: Role;
  country: CountryCode;
  avatar?: MediaObject;
  contactId?: string;
  status?: UserStatus;
  logEntriesShared?: boolean;
  deactivatedReason?: string;
  acceptsEmail: boolean;
  diploma?: string;
  staffFunction?: string;
  division?: string;
  deactivated?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  devices?: Device[];
};

export class User {
  readonly id: string;
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly gender: Gender;
  readonly age: number;
  readonly university: University;
  readonly role: Role;
  readonly country: CountryCode;
  readonly acceptsEmail: boolean;
  readonly avatar?: MediaObject;
  readonly status?: UserStatus;
  readonly deactivated?: boolean;
  readonly logEntriesShared?: boolean;
  readonly deactivatedReason?: string;
  readonly diploma?: string;
  readonly division?: string;
  readonly staffFunction?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly contactId: string;
  devices: Device[];

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.firstname = props.firstname;
    this.lastname = props.lastname;
    this.gender = props.gender;
    this.age = props.age;
    this.university = props.university;
    this.role = props.role;
    this.country = props.country;
    this.acceptsEmail = props.acceptsEmail;
    this.avatar = props.avatar;
    this.status = props.status;
    this.deactivatedReason = props.deactivatedReason;
    this.diploma = props.diploma;
    this.division = props.division;
    this.staffFunction = props.staffFunction;
    this.deactivated = props.deactivated;
    this.logEntriesShared = props.logEntriesShared;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.devices = props.devices ?? [];
    this.contactId = props.contactId;
  }

  public filterLearnableLanguages(languages: Language[]): Language[] {
    return this.university.isCentralUniversity()
      ? languages.filter((language) =>
          language.canBeLearntInCentralUniversity(),
        )
      : languages.filter((language) =>
          language.canBeLearntInPartnerUniversity(),
        );
  }
}

export type AdministratorProps = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  attributes: any;
  university: University;
  language: Language;
  groups?: KeycloakGroup[];
  avatar?: MediaObject;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Administrator {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly university?: University;
  readonly language?: Language;
  readonly attributes: any;
  readonly groups?: KeycloakGroup[];
  readonly avatar?: MediaObject;
  readonly status?: UserStatus;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: AdministratorProps) {
    this.id = props.id;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.university = props.university;
    this.language = props.language;
    this.attributes = props.attributes;
    this.groups = props.groups;
    this.avatar = props.avatar;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
