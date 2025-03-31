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
import { LanguageStatus, Tandem, TandemStatus, User } from 'src/core/models';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';
import { CreateCommunityChatUsecase } from 'src/core/usecases/chat';
import { ChatService } from 'src/providers/services/chat.service';

@Injectable()
export class GenerateConversationsUsecase {
  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(CreateCommunityChatUsecase)
    private readonly createCommunityChatUsecase: CreateCommunityChatUsecase,
  ) {}

  async execute() {
    const tandems = await this.tandemRepository.getExistingTandems();
    const users = await this.userRepository.findAll();

    const conversations = [];
    conversations.push(...(await this.generateTandemConversations(tandems)));
    conversations.push(
      ...(await this.generateAnimatorConversations(users.items)),
    );
    await this.generateCommunityChats();

    await this.chatService.createConversations(conversations);
  }

  private async generateTandemConversations(tandems: Tandem[]) {
    const activeTandems = tandems.filter(
      (tandem) => tandem.status === TandemStatus.ACTIVE,
    );

    const conversations = [];
    activeTandems.forEach(async (tandem) => {
      conversations.push({
        participants: [
          tandem.learningLanguages[0].profile.user.id,
          tandem.learningLanguages[1].profile.user.id,
        ],
        tandemId: tandem.id,
      });
    });

    return conversations;
  }

  private async generateAnimatorConversations(users: User[]) {
    const usersWithContact = users.filter((user) => user.contactId);

    const conversations = [];
    usersWithContact.forEach(async (user) => {
      conversations.push({
        participants: [user.id, user.contactId],
      });
    });

    return conversations;
  }

  private async generateCommunityChats() {
    const centralActiveLanguages = await this.languageRepository.all(
      { field: 'mainUniversityStatus', order: 'asc' },
      LanguageStatus.PRIMARY,
    );

    const filteredActiveLanguages = centralActiveLanguages.items.filter(
      (language) => language.code !== '*',
    );

    for (const language of filteredActiveLanguages) {
      await this.createCommunityChatUsecase.execute({
        centralLanguageCode: language.code,
      });
    }
  }
}
