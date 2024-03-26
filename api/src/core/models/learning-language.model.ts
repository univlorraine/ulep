import { Campus } from './campus.model';
import { Language } from './language.model';
import { ProficiencyLevel } from './proficiency.model';
import { LearningType, Profile } from './profile.model';
import { Tandem } from './tandem.model';

interface LearningLanguageProps {
  id: string;
  language: Language;
  level: ProficiencyLevel;
  profile?: Profile;
  createdAt?: Date;
  updatedAt?: Date;
  learningType: LearningType;
  sameGender: boolean;
  sameAge: boolean;
  hasPriority?: boolean;
  certificateOption?: boolean;
  specificProgram?: boolean;
  campus?: Campus;
  tandemLanguage?: Language;
}

export class LearningLanguage {
  readonly id: string;
  readonly language: Language;
  readonly level: ProficiencyLevel;
  readonly profile?: Profile;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly learningType: LearningType;
  readonly sameGender: boolean;
  readonly sameAge: boolean;
  readonly hasPriority?: boolean;
  readonly certificateOption?: boolean;
  readonly specificProgram?: boolean;
  readonly campus?: Campus;
  tandemLanguage?: Language;

  constructor({
    id,
    language,
    level,
    profile,
    createdAt,
    updatedAt,
    learningType,
    sameGender,
    sameAge,
    certificateOption,
    specificProgram,
    campus,
    tandemLanguage,
    hasPriority,
  }: LearningLanguageProps) {
    this.id = id;
    this.language = language;
    this.level = level;
    this.profile = profile;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.learningType = learningType;
    this.sameGender = sameGender;
    this.sameAge = sameAge;
    this.certificateOption = certificateOption;
    this.specificProgram = specificProgram;
    this.campus = campus;
    this.tandemLanguage = tandemLanguage;
    this.hasPriority = hasPriority;
  }

  public isDiscovery(learningLanguageMatch?: LearningLanguage) {
    if (learningLanguageMatch) {
      if (
        (this.learningType === LearningType.TANDEM ||
          (this.learningType === LearningType.BOTH &&
            (learningLanguageMatch.learningType === LearningType.BOTH ||
              learningLanguageMatch.learningType === LearningType.TANDEM))) &&
        this.campus &&
        this.campus.id === learningLanguageMatch.campus?.id
      ) {
        return true;
      }
    }

    return (
      this.language.isDiscovery ||
      this.language.isJokerLanguage() ||
      this.learningType === LearningType.TANDEM
    );
  }

  public isCompatibleWithLearningLanguage(
    learningLanguage: LearningLanguage,
  ): boolean {
    if (this.language.isJokerLanguage()) {
      // Author note: we currently do not check if joker language match a language spoken
      // by other profile and not spoken by this learningLanguage's profile here as:
      // - This is done in match score computation, where it needs to return the language
      // - It depends on other external elements such as available languages
      return true;
    } else {
      if (learningLanguage.profile.isSpeakingLanguage(this.language)) {
        return true;
      }
    }

    return false;
  }
}

interface LearningLanguageWithTandemProps extends LearningLanguageProps {
  tandem?: Tandem;
}

export class LearningLanguageWithTandem extends LearningLanguage {
  readonly tandem?: Tandem;

  constructor(props: LearningLanguageWithTandemProps) {
    super(props);
    this.tandem = props.tandem;
  }
}
