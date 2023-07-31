import { ProfileLanguagesException } from '../errors/profile-exceptions';
import { Interest } from './interest.model';
import { Language, LearningLanguage } from './language.model';
import { LearningPreferences } from './learning-preferences';
import { ProficiencyLevel } from './proficiency.model';
import { User } from './user.model';

export type Languages = {
  native: Language;
  mastered: Language[];
  learning?: LearningLanguage;
};

export type CreateProfileProps = {
  id: string;
  user: User;
  languages: Languages;
  preferences: LearningPreferences;
  interests: Interest[];
  bio?: string;
};

export class Profile {
  #id: string;
  #user: User;
  #languages: Languages;
  #preferences: LearningPreferences;
  #interests: Interest[];
  #bio?: string;

  constructor(props: CreateProfileProps) {
    this.#id = props.id;
    this.#user = props.user;
    this.#interests = props.interests;
    this.#bio = props.bio;
    this.languages = props.languages;
    this.preferences = props.preferences;
  }

  get id(): string {
    return this.#id;
  }

  get user(): User {
    return this.#user;
  }

  get university(): string {
    return this.#user.university.id;
  }

  get role(): string {
    return this.#user.role;
  }

  get age(): number {
    return this.#user.age;
  }

  get gender(): string {
    return this.#user.gender;
  }

  get languages(): Languages {
    return this.#languages;
  }

  set languages(languages: Languages) {
    this.#languages = languages;

    this.assertLanguesAreUnique();

    if (!languages.learning.code) {
      this.#languages.learning.level = ProficiencyLevel.A0;
    }
  }

  get preferences(): LearningPreferences {
    return this.#preferences;
  }

  set preferences(preferences: LearningPreferences) {
    this.#preferences = preferences;
  }

  get interests(): Interest[] {
    return this.#interests;
  }

  get bio(): string | undefined {
    return this.#bio;
  }

  private assertLanguesAreUnique(): void {
    const { native, mastered, learning } = this.#languages;
    const masteredLanguages = mastered.map((l) => l.code);

    if (learning && native.code === learning.code) {
      throw new ProfileLanguagesException(
        'Native and learning languages cannot be the same',
      );
    }

    if (masteredLanguages.includes(native.code)) {
      throw new ProfileLanguagesException(
        'Native and mastered languages cannot be the same',
      );
    }

    if (learning && masteredLanguages.includes(learning.code)) {
      throw new ProfileLanguagesException(
        'Learning and mastered languages cannot be the same',
      );
    }
  }
}
