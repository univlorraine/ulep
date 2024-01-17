import { Inject, Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import {
  DomainErrorCode,
  RessourceAlreadyExists,
  RessourceDoesNotExist,
} from 'src/core/errors';
import {
  ProfileCampusException,
  ProfileHasMaxNumberOfLearningLanguages,
} from 'src/core/errors/profile-exceptions';
import { UnsuportedLanguageException } from 'src/core/errors/unsuported-language.exception';
import {
  Interest,
  Language,
  LearningLanguage,
  LearningObjective,
  LearningType,
  MeetingFrequency,
  ProficiencyLevel,
  Profile,
  User,
} from 'src/core/models';
import EmailContent, {
  EMAIL_TEMPLATE_IDS,
} from 'src/core/models/email-content.model';
import {
  EMAIL_TEMPLATE_REPOSITORY,
  EmailTemplateRepository,
} from 'src/core/ports/email-template.repository';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from 'src/core/ports/interest.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class CreateProfileCommand {
  user: string;
  nativeLanguageCode: string;
  masteredLanguageCodes?: string[];
  learningLanguages: {
    code: string;
    level: ProficiencyLevel;
    learningType: LearningType;
    sameGender: boolean;
    sameAge: boolean;
    campusId?: string;
    certificateOption?: boolean;
    specificProgram?: boolean;
  }[];
  objectives: string[];
  meetingFrequency: MeetingFrequency;
  interests: string[];
  bios?: string;
}

@Injectable()
export class CreateProfileUsecase {
  private readonly logger = new Logger(CreateProfileUsecase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(INTEREST_REPOSITORY)
    private readonly interestsRepository: InterestRepository,
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(EMAIL_TEMPLATE_REPOSITORY)
    private readonly emailTemplateRepository: EmailTemplateRepository,
  ) {}

  async execute(command: CreateProfileCommand): Promise<Profile> {
    const user = await this.tryToFindTheUserOfId(command.user);

    await this.assertProfileDoesNotExistForUser(user.id);

    const interests = await Promise.all(
      command.interests.map((id) => this.tryToFindTheInterestOfId(id)),
    );

    const nativeLanguage = await this.tryToFindTheLanguageOfCode(
      command.nativeLanguageCode,
    );

    const masteredLanguages = await Promise.all(
      (command.masteredLanguageCodes ?? []).map((code) =>
        this.tryToFindTheLanguageOfCode(code),
      ),
    );

    if (command.learningLanguages.length > user.university.maxTandemsPerUser) {
      throw new ProfileHasMaxNumberOfLearningLanguages(
        `Only ${user.university.maxTandemsPerUser} learning languages are accepted per profile`,
      );
    }

    const learningLanguages = await Promise.all(
      command.learningLanguages.map(async (learningLanguage) => {
        const language = await this.tryToFindTheLanguageOfCode(
          learningLanguage.code,
        );

        if (
          !language.isJokerLanguage() &&
          !user.university.supportLanguage(language)
        ) {
          throw new UnsuportedLanguageException(
            `The language is not supported by the university`,
          );
        }

        if (
          !learningLanguage.campusId &&
          (learningLanguage.learningType === LearningType.TANDEM ||
            learningLanguage.learningType === LearningType.BOTH)
        ) {
          throw new ProfileCampusException(
            'A campus is required for tandem/both learningType',
          );
        }
        let campus;
        if (learningLanguage.campusId) {
          campus = user.university.campus.find(
            (campus) => campus.id === learningLanguage.campusId,
          );
          if (!campus) {
            throw new ProfileCampusException(
              `${learningLanguage.campusId} not part of user's university`,
            );
          }
        }

        return new LearningLanguage({
          id: this.uuidProvider.generate(),
          language,
          level: learningLanguage.level,
          learningType: learningLanguage.learningType,
          sameGender: learningLanguage.sameGender,
          sameAge: learningLanguage.sameAge,
          certificateOption: learningLanguage.certificateOption,
          specificProgram: learningLanguage.specificProgram,
          campus: campus,
        });
      }),
    );

    const objectives = await Promise.all(
      command.objectives.map((id) => this.tryToFindTheObjectiveOfId(id)),
    );

    const profile = new Profile({
      ...command,
      id: this.uuidProvider.generate(),
      user: user,
      nativeLanguage,
      masteredLanguages,
      learningLanguages,
      objectives,
      interests,
    });

    await this.profilesRepository.create(profile);

    await this.sendWelcomeEmail(profile);

    return profile;
  }

  private async tryToFindTheUserOfId(id: string): Promise<User> {
    const user = await this.usersRepository.ofId(id);
    if (!user) {
      throw new RessourceDoesNotExist('User does not exist');
    }

    return user;
  }

  private async assertProfileDoesNotExistForUser(id: string): Promise<void> {
    const profile = await this.profilesRepository.ofUser(id);
    if (profile) {
      throw new RessourceAlreadyExists();
    }
  }

  private async tryToFindTheInterestOfId(id: string): Promise<Interest> {
    const interest = await this.interestsRepository.interestOfId(id);
    if (!interest) {
      throw new RessourceDoesNotExist('Interest does not exist');
    }

    return interest;
  }

  private async tryToFindTheLanguageOfCode(code: string): Promise<Language> {
    const language = await this.languageRepository.ofCode(code.toLowerCase());
    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }

  private async tryToFindTheObjectiveOfId(
    id: string,
  ): Promise<LearningObjective> {
    const objective = await this.objectiveRepository.ofId(id);
    if (!objective) {
      throw new RessourceDoesNotExist(
        'The objective does not exist',
        DomainErrorCode.BAD_REQUEST,
      );
    }

    return objective;
  }

  private async sendWelcomeEmail(profile: Profile): Promise<void> {
    let email: EmailContent;

    try {
      email = await this.emailTemplateRepository.getEmail(
        EMAIL_TEMPLATE_IDS.WELCOME,
        profile.nativeLanguage.code,
        { firstname: profile.user.firstname },
      );
    } catch (error) {
      this.logger.error('Error while parsing welcome email', error);
      Sentry.captureException(error);
    }

    try {
      await this.emailGateway.send({
        recipient: profile.user.email,
        email: email,
      });
    } catch (error) {
      this.logger.error('Error while sending welcome email', error);
      Sentry.captureException(error);
    }
  }
}
