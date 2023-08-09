import { ProfileLanguagesException } from '../errors/profile-exceptions';
import { Interest } from './interest.model';
import {
  JOKER_LANGUAGE_CODE,
  Language,
  LearningLanguage,
} from './language.model';
import { LearningObjective } from './objective.model';
import { ProficiencyLevel } from './proficiency.model';
import { User } from './user.model';

export enum LearningType {
  ETANDEM = 'ETANDEM',
  TANDEM = 'TANDEM',
  BOTH = 'BOTH',
}

export type CreateProfileProps = {
  id: string;
  user: User;
  nativeLanguage: Language;
  masteredLanguages: Language[];
  learningLanguages: LearningLanguage[];
  learningType: LearningType;
  meetingFrequency: string;
  sameGender: boolean;
  sameAge: boolean;
  objectives: LearningObjective[];
  interests: Interest[];
  biography?: { [key: string]: string };
};

export class Profile {
  readonly id: string;

  readonly user: User;

  readonly nativeLanguage: Language;

  readonly masteredLanguages: Language[];

  readonly learningLanguages: LearningLanguage[];

  readonly learningType: LearningType;

  readonly meetingFrequency: string;

  readonly sameGender: boolean;

  readonly sameAge: boolean;

  readonly objectives: LearningObjective[];

  readonly interests: Interest[];

  readonly biography?: { [key: string]: string };

  constructor(props: CreateProfileProps) {
    const learningLanguages = [...props.learningLanguages].map(
      (learningLanguage) => ({
        language: learningLanguage.language,
        level:
          learningLanguage.language.code !== JOKER_LANGUAGE_CODE
            ? learningLanguage.level
            : ProficiencyLevel.A0,
      }),
    );

    this.id = props.id;
    this.user = props.user;
    this.nativeLanguage = props.nativeLanguage;
    this.masteredLanguages = [...props.masteredLanguages];
    this.learningLanguages = learningLanguages;
    this.learningType = props.learningType;
    this.meetingFrequency = props.meetingFrequency;
    this.sameGender = props.sameGender;
    this.sameAge = props.sameAge;
    this.objectives = [...props.objectives];
    this.interests = [...props.interests];
    this.biography = props.biography;

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
}
