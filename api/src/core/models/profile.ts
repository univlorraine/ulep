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

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ProfilePreferences = {
  meetingFrequency: MeetingFrequency;
  sameGender: boolean;
};

export type Language = {
  code: string;
};

export type CreateProfileProps = {
  id: string;
  user: User;
  firstname: string;
  lastname: string;
  age: number;
  role: Role;
  gender: Gender;
  university: University;
  nationality: Country;
  nativeLanguage: Language;
  masteredLanguages: Language[];
  learningLanguage: Language;
  learningLanguageLevel: CEFRLevel;
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

  #age: number;

  #gender: Gender;

  #role: Role;

  #university: University;

  #nationality: Country;

  #nativeLanguage: Language;

  #masteredLanguages: Language[];

  #learningLanguage: Language;

  #learningLanguageLevel: CEFRLevel;

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
    this.age = props.age;
    this.gender = props.gender;
    this.role = props.role;
    this.university = props.university;
    this.nationality = props.nationality;
    this.#nativeLanguage = props.nativeLanguage;
    this.#masteredLanguages = props.masteredLanguages;
    this.#learningLanguage = props.learningLanguage;
    this.#learningLanguageLevel = props.learningLanguageLevel;
    this.goals = props.goals;
    this.interests = props.interests;
    this.bios = props.bios;
    this.preferences = props.preferences;
    this.avatar = props.avatar;

    this.assertLanguesAreUnique();
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

  get age(): number {
    return this.#age;
  }

  set age(age: number) {
    if (age < 16 || age > 100) {
      throw new Error('Age must be between 18 and 100');
    }

    this.#age = age;
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

  get nativeLanguage(): Language {
    return this.#nativeLanguage;
  }

  set nativeLanguage(nativeLanguage: Language) {
    this.#nativeLanguage = nativeLanguage;

    this.assertLanguesAreUnique();
  }

  get masteredLanguages(): Language[] {
    return this.#masteredLanguages;
  }

  set masteredLanguages(masteredLanguages: Language[]) {
    this.#masteredLanguages = masteredLanguages;

    this.assertLanguesAreUnique();
  }

  get learningLanguage(): Language {
    return this.#learningLanguage;
  }

  set learningLanguage(learningLanguage: Language) {
    this.#learningLanguage = learningLanguage;

    this.assertLanguesAreUnique();
  }

  get learningLanguageLevel(): CEFRLevel {
    return this.#learningLanguageLevel;
  }

  set learningLanguageLevel(learningLanguageLevel: CEFRLevel) {
    this.#learningLanguageLevel = learningLanguageLevel;
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

  private assertLanguesAreUnique(): void {
    if (this.#nativeLanguage.code === this.#learningLanguage.code) {
      throw new Error('Native and learning languages cannot be the same');
    }

    if (
      this.#masteredLanguages.some(
        (language) => language.code === this.#nativeLanguage?.code,
      )
    ) {
      throw new Error('Native and mastered languages cannot be the same');
    }

    if (
      this.#masteredLanguages.some(
        (language) => language.code === this.#learningLanguage?.code,
      )
    ) {
      throw new Error('Learning and mastered languages cannot be the same');
    }
  }
}
