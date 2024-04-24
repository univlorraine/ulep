import Device from './device.model';
import { CountryCode } from './country-code.model';
import { Language } from './language.model';
import { MediaObject } from './media.model';
import { University } from './university.model';

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
  status?: UserStatus;
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
  readonly deactivatedReason?: string;
  readonly diploma?: string;
  readonly division?: string;
  readonly staffFunction?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
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
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.devices = props.devices ?? [];
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
