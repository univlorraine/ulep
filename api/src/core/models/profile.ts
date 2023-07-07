import { Gender, Role } from '@prisma/client';
import { University } from './university';
import MediaObject from './media-object';
import { Country } from './country';
import { User } from './user';

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

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ProfilePreferences = {
  meetingFrequency: MeetingFrequency;
  sameGender: boolean;
};

export type NativeLanguage = {
  id: string;
  code: string;
};

export type LearningLanguage = {
  id: string;
  code: string;
  level: CEFRLevel;
};

export type CreateProfileProps = {
  id: string;
  user: User;
  firstname: string;
  lastname: string;
  birthdate: Date;
  role: Role;
  gender: Gender;
  university: University;
  nationality: Country;
  nativeLanguage: NativeLanguage;
  learningLanguage: LearningLanguage;
  goals: Set<Goal>;
  interests: Set<string>;
  bios?: string;
  preferences: ProfilePreferences;
  avatar?: MediaObject;
};

export class Profile {
  #id: string;

  #user: User;

  #firstname: string;

  #lastname: string;

  #birthdate: Date;

  #gender: Gender;

  #role: Role;

  #university: University;

  #nationality: Country;

  #nativeLanguage: NativeLanguage;

  #learningLanguage: LearningLanguage;

  #goals: Set<Goal>;

  #interests: Set<string>;

  #bios?: string;

  #preferences: ProfilePreferences;

  #avatar?: MediaObject;

  constructor(props: CreateProfileProps) {
    this.#id = props.id;
    this.#user = props.user;
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
    this.interests = props.interests;
    this.bios = props.bios;
    this.preferences = props.preferences;
    this.avatar = props.avatar;
  }

  get id(): string {
    return this.#id;
  }

  get user(): User {
    return this.#user;
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

  get goals(): Set<Goal> {
    return this.#goals;
  }

  set goals(goals: Set<Goal>) {
    this.#goals = goals;
  }

  get interests(): Set<string> {
    return this.#interests;
  }

  set interests(interests: Set<string>) {
    if (5 < interests.size) {
      throw new Error('Max 5 interests allowed');
    }
    this.#interests = interests;
  }

  get bios(): string | undefined {
    return this.#bios;
  }

  set bios(bios: string | undefined) {
    this.#bios = bios;
  }

  get preferences(): ProfilePreferences {
    return this.#preferences;
  }

  set preferences(preferences: ProfilePreferences) {
    this.#preferences = preferences;
  }

  get age(): number {
    const now = new Date();
    const birthdate = this.#birthdate;
    let age = now.getFullYear() - birthdate.getFullYear();
    const month = now.getMonth() - birthdate.getMonth();
    if (month < 0 || (0 === month && now.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }
}
