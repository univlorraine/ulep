import { University } from './university';
import MediaObject from './media-object';
import { User } from './user';
import { DomainError } from '../errors/errors';
import { ProfileLanguagesException } from '../errors/ProfileExceptions';

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LearningType = 'ETANDEM' | 'TANDEM' | 'BOTH';

export type LearningPreferences = {
  learningType: LearningType;
  meetingFrequency: string;
  sameGender: boolean;
  goals: string[];
};

export type PersonalInformation = {
  age: number;
  gender: Gender;
  interests: string[];
  bio?: string;
};

export type Languages = {
  nativeLanguage: string;
  masteredLanguages: string[];
  learningLanguage?: string;
  learningLanguageLevel: CEFRLevel;
};

export type CreateProfileProps = {
  id: string;
  user: User;
  role: Role;
  university: University;
  personalInformation: PersonalInformation;
  languages: Languages;
  preferences: LearningPreferences;
  avatar?: MediaObject;
};

export class Profile {
  #id: string;

  #user: User;

  #personalInformation: PersonalInformation;

  #role: Role;

  #university: University;

  #languages: Languages;

  #preferences: LearningPreferences;

  #avatar?: MediaObject;

  constructor(props: CreateProfileProps) {
    this.#id = props.id;
    this.#user = props.user;
    this.personalInformation = props.personalInformation;
    this.role = props.role;
    this.university = props.university;
    this.languages = props.languages;
    this.preferences = props.preferences;
    this.avatar = props.avatar;
  }

  get id(): string {
    return this.#id;
  }

  get user(): User {
    return this.#user;
  }

  get personalInformation(): PersonalInformation {
    return this.#personalInformation;
  }

  set personalInformation(personalInformation: PersonalInformation) {
    if (personalInformation.age < 1) {
      throw new DomainError('Age must be greater than 0');
    }

    this.#personalInformation = personalInformation;
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

  get languages(): Languages {
    return this.#languages;
  }

  set languages(languages: Languages) {
    this.#languages = languages;

    this.assertLanguesAreUnique();

    if (!languages.learningLanguage) {
      this.#languages.learningLanguageLevel = 'A0';
    }
  }

  get preferences(): LearningPreferences {
    return this.#preferences;
  }

  set preferences(preferences: LearningPreferences) {
    this.#preferences = preferences;
  }

  get avatar(): MediaObject | undefined {
    return this.#avatar;
  }

  set avatar(avatar: MediaObject | undefined) {
    this.#avatar = avatar;
  }

  private assertLanguesAreUnique(): void {
    // eslint-disable-next-line prettier/prettier
    const { nativeLanguage, masteredLanguages, learningLanguage } = this.#languages;

    if (learningLanguage && nativeLanguage === learningLanguage) {
      throw new ProfileLanguagesException(
        'Native and learning languages cannot be the same',
      );
    }

    if (masteredLanguages.includes(nativeLanguage)) {
      throw new ProfileLanguagesException(
        'Native and mastered languages cannot be the same',
      );
    }

    if (learningLanguage && masteredLanguages.includes(learningLanguage)) {
      throw new ProfileLanguagesException(
        'Learning and mastered languages cannot be the same',
      );
    }
  }
}
