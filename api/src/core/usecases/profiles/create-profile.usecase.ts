/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
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
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_HISTORY_REPOSITORY,
  TandemHistoryRepository,
} from 'src/core/ports/tandem-history.repository';
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
    sameTandem: boolean;
    campusId?: string;
    certificateOption?: boolean;
    specificProgram?: boolean;
  }[];
  objectives: string[];
  meetingFrequency: MeetingFrequency;
  interests: string[];
}

@Injectable()
export class CreateProfileUsecase {
  private readonly logger = new Logger(CreateProfileUsecase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(INTEREST_REPOSITORY)
    private readonly interestsRepository: InterestRepository,
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
    @Inject(TANDEM_HISTORY_REPOSITORY)
    private readonly tandemHistoryRepository: TandemHistoryRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
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

        const historizedUnmatchedLearningLanguage =
          await this.learningLanguageRepository.getHistoricUnmatchedLearningLanguageByUserIdAndLanguageId(
            user.id,
            language.id,
          );
        let sameTandemEmail;
        if (learningLanguage.sameTandem) {
          const historyTandem =
            await this.tandemHistoryRepository.getHistoryTandemFormUserIdAndLanguageId(
              user.id,
              language.id,
            );
          const otherUser =
            await this.tandemHistoryRepository.getOtherUserInTandemHistory(
              user.id,
              historyTandem.tandemId,
            );
          sameTandemEmail = otherUser.userEmail;
        }

        return new LearningLanguage({
          id: this.uuidProvider.generate(),
          language,
          level: learningLanguage.level,
          learningType: learningLanguage.learningType,
          sameGender: learningLanguage.sameGender,
          sameAge: learningLanguage.sameAge,
          sameTandemEmail,
          certificateOption: learningLanguage.certificateOption,
          specificProgram: learningLanguage.specificProgram,
          hasPriority: Boolean(historizedUnmatchedLearningLanguage),
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
      testedLanguages: [],
      objectives,
      interests,
    });

    await this.profilesRepository.create(profile);

    if (profile.user.acceptsEmail) {
      await this.sendWelcomeEmail(profile);
    }

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
    try {
      this.emailGateway.sendWelcomeMail({
        to: profile.user.email,
        language: profile.nativeLanguage.code,
        user: {
          firstname: profile.user.firstname,
          lastname: profile.user.lastname,
        },
      });
    } catch (error) {
      this.logger.error('Error while sending welcome email', error);
    }
  }
}
