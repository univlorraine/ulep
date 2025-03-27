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
  RessourceDoesNotExist,
  UnsuportedLanguageException,
} from 'src/core/errors';
import {
  ProfileCampusException,
  ProfileHasMaxNumberOfLearningLanguages,
} from 'src/core/errors/profile-exceptions';
import {
  LearningLanguage,
  LearningType,
  ProficiencyLevel,
} from 'src/core/models';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  TandemHistoryRepository,
  TANDEM_HISTORY_REPOSITORY,
} from 'src/core/ports/tandem-history.repository';
import {
  UuidProviderInterface,
  UUID_PROVIDER,
} from 'src/core/ports/uuid.provider';
import { AddUserToCommunityChatUsecase } from 'src/core/usecases/chat/add-user-to-community-chat.usecase';

export interface CreateLearningLanguageCommand {
  profileId: string;
  code: string;
  level: ProficiencyLevel;
  learningType: LearningType;
  sameGender: boolean;
  sameAge: boolean;
  sameTandem: boolean;
  campusId?: string;
  certificateOption?: boolean;
  specificProgram?: boolean;
}

@Injectable()
export class CreateLearningLanguageUseCase {
  private readonly logger = new Logger(CreateLearningLanguageUseCase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(TANDEM_HISTORY_REPOSITORY)
    private readonly tandemHistoryRepository: TandemHistoryRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
    @Inject(AddUserToCommunityChatUsecase)
    private readonly addUserToCommunityChatUsecase: AddUserToCommunityChatUsecase,
  ) {}

  async execute(
    command: CreateLearningLanguageCommand,
  ): Promise<LearningLanguage> {
    const profile = await this.profilesRepository.ofId(command.profileId);
    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }

    const maxTandemCount = profile.user.university.maxTandemsPerUser;
    const learningLanguagesCount = profile.learningLanguages.length;
    if (learningLanguagesCount >= maxTandemCount) {
      throw new ProfileHasMaxNumberOfLearningLanguages(
        `Profile already has ${learningLanguagesCount} learning languages`,
      );
    }

    const language = await this.languageRepository.ofCode(command.code);
    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    if (
      !language.isJokerLanguage() &&
      !profile.user.university.supportLanguage(language, command.learningType)
    ) {
      throw new UnsuportedLanguageException(
        `The language is not supported by the university`,
      );
    }

    if (
      !command.campusId &&
      (command.learningType === LearningType.TANDEM ||
        command.learningType === LearningType.BOTH)
    ) {
      throw new ProfileCampusException(
        'A campus is required for tandem / both learningType',
      );
    }
    let campus;
    if (command.campusId) {
      campus = profile.user.university.campus.find(
        (campus) => campus.id === command.campusId,
      );
      if (!campus) {
        throw new ProfileCampusException(
          `${command.campusId} not part of user's university`,
        );
      }
    }

    const historizedUnmatchedLearningLanguage =
      await this.learningLanguageRepository.getHistoricUnmatchedLearningLanguageByUserIdAndLanguageId(
        profile.user.id,
        language.id,
      );

    let sameTandemEmail;
    if (command.sameTandem) {
      const historyTandem =
        await this.tandemHistoryRepository.getHistoryTandemFormUserIdAndLanguageId(
          profile.user.id,
          language.id,
        );
      const otherUser =
        await this.tandemHistoryRepository.getOtherUserInTandemHistory(
          profile.user.id,
          historyTandem.tandemId,
        );
      sameTandemEmail = otherUser.userEmail;
    }

    const item = new LearningLanguage({
      id: this.uuidProvider.generate(),
      language,
      level: command.level,
      profile: profile,
      learningType: command.learningType,
      sameGender: command.sameGender,
      sameAge: command.sameAge,
      sameTandemEmail,
      certificateOption: command.certificateOption,
      specificProgram: command.specificProgram,
      hasPriority: Boolean(historizedUnmatchedLearningLanguage),
      campus: campus,
    });

    await this.learningLanguageRepository.create(item);

    await this.addUserToCommunityChatUsecase.execute({
      profileId: profile.id,
      learningLanguageId: language.id,
    });

    return item;
  }
}
