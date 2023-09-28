import { ProfileLanguagesException } from '../errors/profile-exceptions';
import { Interest } from './interest.model';
import { Language } from './language.model';
import { LearningLanguage } from './learning-language.model';
import { LearningObjective } from './objective.model';
import { ProficiencyLevel } from './proficiency.model';
import { User } from './user.model';

export enum LearningType {
  ETANDEM = 'ETANDEM',
  TANDEM = 'TANDEM',
  BOTH = 'BOTH',
}

export enum AvailabilitesOptions {
  UNAVAILABLE = 'UNAVAILABLE',
  AVAILABLE = 'AVAILABLE',
  VERY_AVAILABLE = 'VERY_AVAILABLE',
}

export interface Availabilites {
  monday: AvailabilitesOptions;
  tuesday: AvailabilitesOptions;
  wednesday: AvailabilitesOptions;
  thursday: AvailabilitesOptions;
  friday: AvailabilitesOptions;
  saturday: AvailabilitesOptions;
  sunday: AvailabilitesOptions;
}

export type CreateProfileProps = {
  id: string;
  user: User;
  nativeLanguage: Language;
  masteredLanguages: Language[];
  learningLanguages: LearningLanguage[];
  meetingFrequency: string;
  objectives: LearningObjective[];
  interests: Interest[];
  availabilities?: Availabilites;
  availabilitiesNote?: string;
  availavilitiesNotePrivacy?: boolean;
  biography?: { [key: string]: string };
  createdAt?: Date;
};

export class Profile {
  readonly id: string;

  readonly user: User;

  readonly nativeLanguage: Language;

  readonly masteredLanguages: Language[];

  readonly learningLanguages: LearningLanguage[];

  readonly meetingFrequency: string;

  readonly objectives: LearningObjective[];

  readonly interests: Interest[];

  readonly availabilities?: Availabilites;

  readonly availabilitiesNote?: string;

  readonly availavilitiesNotePrivacy?: boolean;

  readonly biography?: { [key: string]: string };

  readonly createdAt?: Date;

  constructor(props: CreateProfileProps) {
    const learningLanguages = [...props.learningLanguages].map(
      (learningLanguage) =>
        new LearningLanguage({
          ...learningLanguage,
          level: learningLanguage.language.isJokerLanguage()
            ? ProficiencyLevel.A0
            : learningLanguage.level,
        }),
    );

    this.id = props.id;
    this.user = props.user;
    this.nativeLanguage = props.nativeLanguage;
    this.masteredLanguages = [...props.masteredLanguages];
    this.learningLanguages = learningLanguages;
    this.meetingFrequency = props.meetingFrequency;
    this.availabilities = props.availabilities;
    this.availabilitiesNote = props.availabilitiesNote;
    this.availavilitiesNotePrivacy = props.availavilitiesNotePrivacy;
    this.objectives = [...props.objectives];
    this.interests = [...props.interests];
    this.biography = props.biography;
    this.createdAt = props.createdAt;

    this.assertLanguesAreUnique();
  }

  protected assertLanguesAreUnique(): void {
    const masteredLanguagesCodes = this.masteredLanguages.map((l) => l.code);

    if (
      this.learningLanguages.length &&
      this.learningLanguages.some(
        (learningLanguage) =>
          learningLanguage.language.code === this.nativeLanguage.code,
      )
    ) {
      throw new ProfileLanguagesException(
        'Native language cannot be a learning language',
      );
    }

    if (masteredLanguagesCodes.includes(this.nativeLanguage.code)) {
      throw new ProfileLanguagesException(
        'Native language cannot be a mastered language',
      );
    }

    const intersectionMasteredAndLearningLanguages =
      this.learningLanguages.filter((learningLanguage) =>
        masteredLanguagesCodes.includes(learningLanguage.language.code),
      );
    if (intersectionMasteredAndLearningLanguages.length > 0) {
      throw new ProfileLanguagesException(
        'A language cannot be in learning and mastered languages',
      );
    }
  }

  get spokenLanguages(): Language[] {
    return [this.nativeLanguage, ...this.masteredLanguages];
  }

  public isSpeakingLanguage(language: Language): boolean {
    return this.spokenLanguages.some(
      (spokenLanguage) => spokenLanguage.id === language.id,
    );
  }

  public isLearningLanguage(language: Language): boolean {
    return this.learningLanguages.some(
      (learningLanguage) => learningLanguage.language.id === language.id,
    );
  }

  /**
   * Check if this profile can learn a language from another profile
   * @param profile Profile from which we want to learn
   * @param availableLanguages Available languages to be learnt in system
   * @returns {boolean}
   */
  public canLearnALanguageFromProfile(
    profile: Profile,
    availableLanguages: Language[],
  ): boolean {
    const potentialLanguagesToLearnFromProfile = this.user
      .filterLearnableLanguages(availableLanguages)
      .filter(
        (language) =>
          !language.isJokerLanguage() &&
          (profile.isSpeakingLanguage(language) ||
            // We include language learnt by other profile as current profile can
            // be searching for tandem in discover mode
            profile.isLearningLanguage(language)) &&
          !this.isSpeakingLanguage(language),
      );
    if (potentialLanguagesToLearnFromProfile.length === 0) {
      return false;
    }

    return true;
  }
}
