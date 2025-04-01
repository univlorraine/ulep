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

import { Inject, Injectable } from '@nestjs/common';
import { LanguageStatus } from 'src/core/models';
import { ChatServicePort, CHAT_SERVICE } from 'src/core/ports/chat.service';
import {
  CommunityChatRepository,
  COMMUNITY_CHAT_REPOSITORY,
} from 'src/core/ports/community-chat.repository';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';

export class CreateCommunityChatCommand {
  centralLanguageCode?: string;
  partnerLanguageCode?: string;
}

@Injectable()
export class CreateCommunityChatUsecase {
  constructor(
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatServicePort,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(COMMUNITY_CHAT_REPOSITORY)
    private readonly communityChatRepository: CommunityChatRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CreateCommunityChatCommand) {
    if (command.centralLanguageCode) {
      await this.handleCentralLanguage(command.centralLanguageCode);
    }

    if (command.partnerLanguageCode) {
      await this.handlePartnerLanguage(command.partnerLanguageCode);
    }
  }

  private async handleCentralLanguage(centralLanguageCode: string) {
    const partnerLanguages = await this.languageRepository.all(
      { field: 'code', order: 'asc' },
      'PARTNER',
    );
    for (const partnerLanguage of partnerLanguages.items) {
      await this.createCommunityChatFromLanguagePair(
        centralLanguageCode,
        partnerLanguage.code,
      );
    }
  }

  private async handlePartnerLanguage(partnerLanguageCode: string) {
    const centralLanguages = await this.languageRepository.all(
      { field: 'code', order: 'asc' },
      LanguageStatus.PRIMARY,
    );

    for (const centralLanguage of centralLanguages.items) {
      await this.createCommunityChatFromLanguagePair(
        centralLanguage.code,
        partnerLanguageCode,
      );
    }
  }

  private async createCommunityChatFromLanguagePair(
    centralLanguageCode: string,
    partnerLanguageCode: string,
  ) {
    if (
      centralLanguageCode === partnerLanguageCode ||
      centralLanguageCode === '*' ||
      partnerLanguageCode === '*'
    ) {
      return;
    }

    const communityChatExist =
      await this.communityChatRepository.findByLanguageCodes(
        centralLanguageCode,
        partnerLanguageCode,
      );

    if (communityChatExist) {
      return;
    }

    const profiles =
      await this.profileRepository.findAllWithMasteredLanguageAndLearningLanguage(
        centralLanguageCode,
        partnerLanguageCode,
      );

    const chat = await this.chatService.createConversation(
      profiles.map((profile) => profile.user.id),
    );

    const communityChat = await this.communityChatRepository.create({
      id: chat.id,
      centralLanguageCode,
      partnerLanguageCode,
    });

    return communityChat;
  }
}
