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
import { RessourceDoesNotExist } from 'src/core/errors';
import { PairingMode, University } from 'src/core/models';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import {
  CommunityChatRepository,
  COMMUNITY_CHAT_REPOSITORY,
} from 'src/core/ports/community-chat.repository';
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from 'src/core/ports/country.repository';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';
import { ChatService } from 'src/providers/services/chat.service';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from '../../ports/university.repository';

export class UpdateUniversityCommand {
  id: string;
  name: string;
  countryId: string;
  timezone: string;
  admissionEnd: Date;
  admissionStart: Date;
  openServiceDate: Date;
  closeServiceDate: Date;
  codes: string[];
  domains: string[];
  website: string;
  pairingMode: PairingMode;
  maxTandemsPerUser: number;
  notificationEmail?: string;
  specificLanguagesAvailableIds: string[];
  nativeLanguageId: string;
  defaultContactId?: string;
}

@Injectable()
export class UpdateUniversityUsecase {
  private readonly logger = new Logger(UpdateUniversityUsecase.name);

  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
    @Inject(COMMUNITY_CHAT_REPOSITORY)
    private readonly communityChatRepository: CommunityChatRepository,
  ) {}

  async execute(command: UpdateUniversityCommand) {
    this.logger.log(JSON.stringify(command));
    const university = await this.universityRepository.ofId(command.id);
    if (!university) {
      throw new RessourceDoesNotExist();
    }

    let specificLanguagesAvailable = [];
    if (command.specificLanguagesAvailableIds) {
      specificLanguagesAvailable = await Promise.all(
        command.specificLanguagesAvailableIds.map((id) =>
          this.languageRepository.ofId(id),
        ),
      );

      if (specificLanguagesAvailable.some((language) => !language)) {
        throw new RessourceDoesNotExist(
          'One or more specified language IDs do not exist.',
        );
      }
    }

    const nativeLanguage = await this.languageRepository.ofId(
      command.nativeLanguageId,
    );
    if (!nativeLanguage) {
      throw new RessourceDoesNotExist('Native language does not exist');
    }

    const country = await this.countryRepository.ofId(command.countryId);
    if (!country) {
      throw new RessourceDoesNotExist('Country does not exist');
    }

    const universityToUpdate = new University({
      id: university.id,
      name: command.name,
      country,
      codes: command.codes || [],
      domains: command.domains || [],
      timezone: command.timezone,
      admissionEnd: command.admissionEnd,
      admissionStart: command.admissionStart,
      openServiceDate: command.openServiceDate,
      closeServiceDate: command.closeServiceDate,
      campus: university.campus,
      website: command.website,
      pairingMode: command.pairingMode,
      maxTandemsPerUser: command.maxTandemsPerUser,
      notificationEmail: command.notificationEmail,
      specificLanguagesAvailable,
      nativeLanguage,
      defaultContactId: command.defaultContactId || university.defaultContactId,
    });

    const { university: updatedUniversity, usersId } =
      await this.universityRepository.update(universityToUpdate);

    if (
      university.defaultContactId &&
      university.defaultContactId !== updatedUniversity.defaultContactId
    ) {
      await this.handleConversation(
        updatedUniversity,
        university.defaultContactId,
        usersId,
      );
    }

    return new University(updatedUniversity);
  }

  private async handleConversation(
    university: University,
    oldContactId: string,
    usersToUpdate: string[],
  ) {
    if (oldContactId && oldContactId !== university.defaultContactId) {
      const profileAdmin = await this.profileRepository.ofUser(oldContactId);

      let chatIdsToIgnore = [];
      if (profileAdmin) {
        chatIdsToIgnore = await this.tandemRepository.getTandemsForProfile(
          profileAdmin.id,
        );
      }

      const communityChats = await this.communityChatRepository.all();
      await this.chatService.deleteConversationByUserId(oldContactId, [
        ...chatIdsToIgnore.map((tandem) => tandem.id),
        ...communityChats.map((chat) => chat.id),
      ]);
      await this.chatService.createConversations(
        usersToUpdate
          .filter((userId) => userId !== university.defaultContactId)
          .map((userId) => ({
            participants: [userId, university.defaultContactId],
          })),
      );
    }
  }
}
