import { User } from 'src/core/models';

export enum LanguageStatus {
  PRIMARY = 'PRIMARY',
  UNACTIVE = 'UNACTIVE',
  SECONDARY = 'SECONDARY',
}

export type LanguageProps = {
  id: string;
  code: string;
  mainUniversityStatus: LanguageStatus;
  secondaryUniversityActive: boolean;
  name?: string;
  isDiscovery: boolean;
};

export type SuggestedLanguageProps = {
  id: string;
  language: Language;
  user: User;
};

export class Language {
  readonly id: string;
  readonly code: string;
  readonly name?: string;
  readonly mainUniversityStatus: LanguageStatus;
  readonly secondaryUniversityActive: boolean;
  readonly isDiscovery: boolean;

  constructor(props: LanguageProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.mainUniversityStatus = props.mainUniversityStatus;
    this.secondaryUniversityActive = props.secondaryUniversityActive;
    this.isDiscovery = props.isDiscovery;
  }

  public isJokerLanguage() {
    return this.code === JOKER_LANGUAGE_CODE;
  }

  public canBeLearntInCentralUniversity() {
    return (
      this.mainUniversityStatus === LanguageStatus.PRIMARY ||
      this.mainUniversityStatus === LanguageStatus.SECONDARY
    );
  }

  public canBeLearntInPartnerUniversity() {
    return (
      this.canBeLearntInCentralUniversity() && this.secondaryUniversityActive
    );
  }
}

export class SuggestedLanguage {
  readonly id: string;
  readonly language: Language;
  readonly user: User;

  constructor(props: SuggestedLanguageProps) {
    this.id = props.id;
    this.language = props.language;
    this.user = props.user;
  }
}

export const JOKER_LANGUAGE_CODE = '*';
