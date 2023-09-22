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

  public isDiscovery() {
    // TODO(discovery+1): asian discovery
    return (
      this.language.isJokerLanguage() ||
      this.learningType === LearningType.TANDEM
    );
  }

  public isCompatibleWithProfile(profile: Profile): boolean {
    // TODO(NOW): see if should inverse assertion (better in protective ?)
    if (!this.language.isJokerLanguage()) {
      if (!profile.isSpeakingLanguage(this.language)) {
        if (!this.isDiscovery() || !profile.isLearningLanguage(this.language)) {
          return false;
        }
      }
    }
    return true;
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
