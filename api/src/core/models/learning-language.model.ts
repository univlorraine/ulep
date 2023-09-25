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
  learningType: LearningType;
  sameGender: boolean;
  sameAge: boolean;
  certificateOption?: boolean;
  specificProgram?: boolean;
  campus?: Campus;
}

export class LearningLanguage {
  readonly id: string;
  readonly language: Language;
  readonly level: ProficiencyLevel;
  readonly profile?: Profile;
  readonly createdAt?: Date;
  readonly learningType: LearningType;
  readonly sameGender: boolean;
  readonly sameAge: boolean;
  readonly certificateOption?: boolean;
  readonly specificProgram?: boolean;
  readonly campus?: Campus;

  constructor({
    id,
    language,
    level,
    profile,
    createdAt,
    learningType,
    sameGender,
    sameAge,
    certificateOption,
    specificProgram,
    campus,
  }: LearningLanguageProps) {
    this.id = id;
    this.language = language;
    this.level = level;
    this.profile = profile;
    this.createdAt = createdAt;
    this.learningType = learningType;
    this.sameGender = sameGender;
    this.sameAge = sameAge;
    this.certificateOption = certificateOption;
    this.specificProgram = specificProgram;
    this.campus = campus;
  }

  public isDiscovery(learningLanguageMatch?: LearningLanguage) {
    // TODO(discovery+1): asian discovery
    if (learningLanguageMatch) {
      if (
        this.learningType === LearningType.BOTH &&
        this.learningType === learningLanguageMatch.learningType &&
        this.campus &&
        this.campus.id === learningLanguageMatch.campus?.id
      ) {
        return true;
      }
    }
    return (
      this.language.isJokerLanguage() ||
      this.learningType === LearningType.TANDEM
    );
  }

  public isCompatibleWithLearningLanguage(
    learningLanguage: LearningLanguage,
  ): boolean {
    if (this.language.isJokerLanguage()) {
      // // TODO(NOW+1): Note: we do not check if joker language match a language spoken
      // by profile 2 but not spoken by profile 1 as this will be done in Score computation and probably return which language is possible in that case
      return true;
    } else {
      if (learningLanguage.profile.isSpeakingLanguage(this.language)) {
        return true;
      } else if (
        this.isDiscovery(learningLanguage) ||
        learningLanguage.profile.isLearningLanguage(this.language)
      ) {
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
