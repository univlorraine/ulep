import { Gender, Role } from '@prisma/client';
import { University } from './university';
import MediaObject from './media-object';
import { Country } from './country';

export enum Goal {
  SPEAK_LIKE_NATIVE = 'SPEAK_LIKE_NATIVE',
  IMPROVE_LEVEL = 'IMPROVE_LEVEL',
  ORAL_PRACTICE = 'ORAL_PRACTICE',
  PREPARE_TRAVEL_ABROAD = 'PREPARE_TRAVEL_ABROAD',
  GET_CERTIFICATION = 'GET_CERTIFICATION',
}

export enum MeetingFrequency {
  ONCE_A_WEEK = 'ONCE_A_WEEK',
  TWICE_A_WEEK = 'TWICE_A_WEEK',
  THREE_TIMES_A_WEEK = 'THREE_TIMES_A_WEEK',
  TWICE_A_MONTH = 'TWICE_A_MONTH',
  THREE_TIMES_A_MONTH = 'THREE_TIMES_A_MONTH',
}

export enum LanguageLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export class NativeLanguage {
  id: string;
  code: string;
}

export class LearningLanguage {
  id: string;
  code: string;
  proficiencyLevel: LanguageLevel;
}

export type CreateProfileProps = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  role: Role;
  gender: Gender;
  university: University;
  nationality: Country;
  nativeLanguage: NativeLanguage;
  learningLanguage: LearningLanguage;
  goals: Goal[];
  meetingFrequency: MeetingFrequency;
  bios?: string;
  avatar?: MediaObject;
};

export class Profile {
  #id: string;

  #email: string;

  #firstname: string;

  #lastname: string;

  #birthdate: Date;

  #gender: Gender;

  #role: Role;

  #university: University;

  #nationality: Country;

  #nativeLanguage: NativeLanguage;

  #learningLanguage: LearningLanguage;

  #goals: Goal[];

  #meetingFrequency: MeetingFrequency;

  #bios?: string;

  #avatar?: MediaObject;

  constructor(props: CreateProfileProps) {
    this.#id = props.id;
    this.email = props.email;
    this.firstname = props.firstname;
    this.lastname = props.lastname;
    this.birthdate = props.birthdate;
    this.gender = props.gender;
    this.role = props.role;
    this.university = props.university;
    this.nationality = props.nationality;
    this.nativeLanguage = props.nativeLanguage;
    this.learningLanguage = props.learningLanguage;
    this.goals = props.goals;
    this.meetingFrequency = props.meetingFrequency;
    this.bios = props.bios;
    this.avatar = props.avatar;
  }

  get id(): string {
    return this.#id;
  }

  get email(): string {
    return this.#email;
  }

  set email(email: string) {
    if ('' === email.trim()) {
      throw new Error('Email cannot be empty');
    }

    this.#email = email;
  }

  get firstname(): string {
    return this.#firstname;
  }

  set firstname(firstname: string) {
    if ('' === firstname.trim()) {
      throw new Error('Firstname cannot be empty');
    }

    this.#firstname = firstname;
  }

  get lastname(): string {
    return this.#lastname;
  }

  set lastname(lastname: string) {
    if ('' === lastname.trim()) {
      throw new Error('Lastname cannot be empty');
    }

    this.#lastname = lastname;
  }

  get birthdate(): Date {
    return this.#birthdate;
  }

  set birthdate(birthdate: Date) {
    if (new Date() < birthdate) {
      throw new Error('Birthdate cannot be in the future');
    }

    this.#birthdate = birthdate;
  }

  get gender(): Gender {
    return this.#gender;
  }

  set gender(gender: Gender) {
    this.#gender = gender;
  }

  get role(): Role {
    return this.#role;
  }

  set role(role: Role) {
    this.#role = role;
  }

  get university(): University {
    return this.#university;
  }

  set university(university: University) {
    this.#university = university;
  }

  get nationality(): Country {
    return this.#nationality;
  }

  set nationality(country: Country) {
    this.#nationality = country;
  }

  get nativeLanguage(): NativeLanguage {
    return this.#nativeLanguage;
  }

  set nativeLanguage(nativeLanguage: NativeLanguage) {
    if (
      this.#learningLanguage &&
      nativeLanguage.code === this.learningLanguage.code
    ) {
      throw new Error('Native and languages cannot be the same');
    }

    this.#nativeLanguage = nativeLanguage;
  }

  get learningLanguage(): LearningLanguage {
    return this.#learningLanguage;
  }

  set learningLanguage(learningLanguage: LearningLanguage) {
    if (
      this.#nativeLanguage &&
      learningLanguage.code === this.nativeLanguage.code
    ) {
      throw new Error('Native and languages cannot be the same');
    }

    this.#learningLanguage = learningLanguage;
  }

  get avatar(): MediaObject | undefined {
    return this.#avatar;
  }

  set avatar(avatar: MediaObject | undefined) {
    this.#avatar = avatar;
  }

  get goals(): Goal[] {
    return this.#goals || [];
  }

  set goals(goals: Goal[]) {
    this.#goals = goals;
  }

  get meetingFrequency(): MeetingFrequency {
    return this.#meetingFrequency;
  }

  set meetingFrequency(meetingFrequency: MeetingFrequency) {
    this.#meetingFrequency = meetingFrequency;
  }

  get bios(): string | undefined {
    return this.#bios;
  }

  set bios(bios: string | undefined) {
    this.#bios = bios;
  }

  get age(): number {
    const now = new Date();
    const birthdate = this.birthdate;
    let age = now.getFullYear() - birthdate.getFullYear();
    const month = now.getMonth() - birthdate.getMonth();
    if (month < 0 || (0 === month && now.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }
}
