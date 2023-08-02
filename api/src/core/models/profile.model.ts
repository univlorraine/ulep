import { ProfileLanguagesException } from '../errors/profile-exceptions';
import { Interest } from './interest.model';
import { Language } from './language.model';
import { Goals, LearningType } from './learning-preferences';
import { ProficiencyLevel } from './proficiency.model';
import { User } from './user.model';

export type CreateProfileProps = {
  id: string;
  user: User;
  nativeLanguage: Language;
  masteredLanguages: Language[];
  learningLanguage?: Language;
  level: ProficiencyLevel;
  learningType: LearningType;
  meetingFrequency: string;
  sameGender: boolean;
  sameAge: boolean;
  goals: Goals[];
  interests: Interest[];
  bio?: string;
};

export class Profile {
  readonly id: string;

  readonly user: User;

  readonly nativeLanguage: Language;

  readonly masteredLanguages: Language[];

  readonly learningLanguage?: Language;

  readonly level: ProficiencyLevel;

  readonly learningType: LearningType;

  readonly meetingFrequency: string;

  readonly sameGender: boolean;

  readonly sameAge: boolean;

  readonly goals: Goals[];

  readonly interests: Interest[];

  readonly bio?: string;

  constructor(props: CreateProfileProps) {
    this.id = props.id;
    this.user = props.user;
    this.nativeLanguage = props.nativeLanguage;
    this.masteredLanguages = [...props.masteredLanguages];
    this.learningLanguage = props.learningLanguage;
    this.level = props.level;
    this.learningType = props.learningType;
    this.meetingFrequency = props.meetingFrequency;
    this.sameGender = props.sameGender;
    this.sameAge = props.sameAge;
    this.goals = [...props.goals];
    this.interests = [...props.interests];
    this.bio = props.bio;

    this.assertLanguesAreUnique();

    if (!props.learningLanguage.code) {
      this.level = ProficiencyLevel.A0;
    }
  }

  protected assertLanguesAreUnique(): void {
    const masteredLanguages = this.masteredLanguages.map((l) => l.code);

    if (
      this.learningLanguage &&
      this.nativeLanguage.code === this.learningLanguage.code
    ) {
      throw new ProfileLanguagesException(
        'Native and learning languages cannot be the same',
      );
    }

    if (masteredLanguages.includes(this.nativeLanguage.code)) {
      throw new ProfileLanguagesException(
        'Native and mastered languages cannot be the same',
      );
    }

    if (
      this.learningLanguage &&
      masteredLanguages.includes(this.learningLanguage.code)
    ) {
      throw new ProfileLanguagesException(
        'Learning and mastered languages cannot be the same',
      );
    }
  }
}
