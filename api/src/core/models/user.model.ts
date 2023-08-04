import { MediaObject } from './media.model';
import { University } from './university.model';

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
  country: string;
  avatar?: MediaObject;
  deactivated: boolean;
  deactivatedReason?: string;
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

  readonly country: string;

  readonly avatar?: MediaObject;

  readonly deactivated: boolean;

  readonly deactivatedReason?: string;

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
    this.avatar = props.avatar;
    this.deactivated = props.deactivated;
    this.deactivatedReason = props.deactivatedReason;
  }
}
