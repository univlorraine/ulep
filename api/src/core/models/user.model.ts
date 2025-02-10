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
