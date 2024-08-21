import { Language } from './language.model';
import { LearningLanguage } from './learning-language.model';
import { User } from './user.model';

export type CreateProfileWithTandemsProfilesProps = {
  id: string;
  user: User;
  nativeLanguage: Language;
  masteredLanguages: Language[];
  learningLanguages: LearningLanguage[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class ProfileWithTandemsProfiles {
  readonly id: string;
  readonly user: User;
  readonly nativeLanguage: Language;
  readonly masteredLanguages: Language[];
  readonly learningLanguages: LearningLanguage[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: CreateProfileWithTandemsProfilesProps) {
    const learningLanguages = [...props.learningLanguages];
    this.id = props.id;
    this.user = props.user;
    this.nativeLanguage = props.nativeLanguage;
    this.masteredLanguages = [...props.masteredLanguages];
    this.learningLanguages = learningLanguages;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
