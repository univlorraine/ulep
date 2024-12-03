import { Campus } from './campus.model';
import { CustomLearningGoal } from './custom-learning-goal.model';
import { Language } from './language.model';
import { MediaObject } from './media.model';
import { ProficiencyLevel } from './proficiency.model';
import { LearningType, Profile } from './profile.model';
import { Tandem } from './tandem.model';
import { TandemWithPartnerLearningLanguage } from './tandemWithPartnerLearningLanguage.model';

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
  sameTandemEmail?: string;
  certificateOption?: boolean;
  learningJournal?: boolean;
  consultingInterview?: boolean;
  sharedCertificate?: boolean;
  certificateFile?: MediaObject;
  specificProgram?: boolean;
  campus?: Campus;
  tandemLanguage?: Language;
  customLearningGoals?: CustomLearningGoal[];
  sharedLogsDate?: Date;
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
  readonly learningJournal?: boolean;
  readonly consultingInterview?: boolean;
  readonly sharedCertificate?: boolean;
  readonly certificateFile?: MediaObject;
  readonly specificProgram?: boolean;
  readonly campus?: Campus;
  tandemLanguage?: Language;
  readonly sameTandemEmail?: string;
  readonly customLearningGoals?: CustomLearningGoal[];
  readonly sharedLogsDate?: Date;
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
    learningJournal,
    consultingInterview,
    sharedCertificate,
    certificateFile,
    specificProgram,
    campus,
    tandemLanguage,
    hasPriority,
    sameTandemEmail,
    customLearningGoals,
    sharedLogsDate,
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
    this.learningJournal = learningJournal;
    this.consultingInterview = consultingInterview;
    this.sharedCertificate = sharedCertificate;
    this.certificateFile = certificateFile;
    this.specificProgram = specificProgram;
    this.campus = campus;
    this.tandemLanguage = tandemLanguage;
    this.hasPriority = hasPriority;
    this.sameTandemEmail = sameTandemEmail;
    this.customLearningGoals = customLearningGoals;
    this.sharedLogsDate = sharedLogsDate;
  }

  public isExclusive() {
    return !!this.sameTandemEmail;
  }

  public isExclusiveWithLearningLanguage(learningLanguage: LearningLanguage) {
    return (
      this.isExclusive() &&
      learningLanguage.isExclusive() &&
      this.sameTandemEmail === learningLanguage.profile.user.email &&
      this.profile.user.email === learningLanguage.sameTandemEmail
    );
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

  public isAvailableInUniversity(): boolean {
    return this.profile.user.university.specificLanguagesAvailable.some(
      (lang) => lang.id === this.language.id,
    );
  }

  public static getLearningType(
    learningLanguage: LearningLanguage,
    learningLanguageMatch: LearningLanguage,
  ) {
    if (
      learningLanguage.profile.user.university.isCentralUniversity() &&
      learningLanguageMatch.profile.user.university.isCentralUniversity() &&
      learningLanguage.campus?.id === learningLanguageMatch.campus?.id
    ) {
      return LearningType.TANDEM;
    }
    return LearningType.ETANDEM;
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

interface LearningLanguageWithTandemWithPartnerLearningLanguageProps
  extends LearningLanguageProps {
  tandem?: TandemWithPartnerLearningLanguage;
}

export class LearningLanguageWithTandemWithPartnerLearningLanguage extends LearningLanguage {
  readonly tandem?: TandemWithPartnerLearningLanguage;

  constructor(
    props: LearningLanguageWithTandemWithPartnerLearningLanguageProps,
  ) {
    super(props);
    this.tandem = props.tandem;
  }
}
