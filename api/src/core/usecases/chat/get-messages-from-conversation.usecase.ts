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

import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/core/models';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';
import {
  ChatPaginationDirection,
  ChatServicePort,
  CHAT_SERVICE,
  Message,
  MessageWithUser,
} from 'src/core/ports/chat.service';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';
import {
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';

export class GetMessagesFromConversationCommand {
  conversationId: string;
  limit: number;
  lastMessageId?: string;
  hashtagFilter?: string;
  typeFilter?: string;
  direction?: ChatPaginationDirection;
  parentId?: string;
}

@Injectable()
export class GetMessagesFromConversationUsecase {
  constructor(
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatServicePort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: GetMessagesFromConversationCommand) {
    const messagesCollection =
      await this.chatService.getMessagesFromConversationId(
        command.conversationId,
        command.limit,
        command.lastMessageId,
        command.hashtagFilter,
        command.typeFilter,
        command.direction,
        command.parentId,
      );

    if (
      messagesCollection &&
      !messagesCollection.items &&
      messagesCollection.totalItems === 0
    ) {
      return [];
    }

    const messages = messagesCollection.items;

    const messagesWithUser = await this.enrichMessageWithUser(messages);

    return messagesWithUser;
  }

  private async enrichMessageWithUser(messages: Message[]) {
    // Get all userIds from conversations and last messages
    const allUserIds = new Set();
    await Promise.all(
      messages.map(async (message) => {
        if (message.ownerId) {
          allUserIds.add(message.ownerId);
        }

        if (message.parent) {
          allUserIds.add(message.parent.ownerId);
        }

        if (message.type === 'vocabulary') {
          message.metadata.vocabularyList =
            await this.enrichMessageWithVocabulary(message);
        }

        if (message.type === 'activity') {
          message.metadata.activity =
            await this.enrichMessageWithActivity(message);
        }

        if (message.parent && message.parent.type === 'vocabulary') {
          message.parent.metadata.vocabularyList =
            await this.enrichMessageWithVocabulary(message.parent);
        }

        if (message.parent && message.parent.type === 'activity') {
          message.parent.metadata.activity =
            await this.enrichMessageWithActivity(message.parent);
        }
      }),
    );

    // Get users data in one query
    const users = await this.userRepository.ofIds(
      Array.from(allUserIds) as string[],
    );
    const userMap = new Map(
      users.map((user: User | UserRepresentation) => [user.id, user]),
    );

    const missingUserIds = Array.from(allUserIds).filter(
      (id: string) => !userMap.has(id) || userMap.get(id) === undefined,
    ) as string[];

    for (const id of missingUserIds) {
      try {
        const userDetails = await this.keycloakClient.getUserById(id);
        userMap.set(id, userDetails);
      } catch (error) {
        userMap.delete(id);
      }
    }
    // Replace userIds by user objects in conversations
    const messagesWithUser = messages.map(
      (message) =>
        ({
          ...message,
          parent: message.parent
            ? ({
                ...message.parent,
                metadata: {
                  ...message.parent.metadata,
                  openGraphResult: message.parent.metadata?.openGraphResult,
                  originalFilename: message.parent.metadata?.originalFilename,
                  thumbnail: message.parent.metadata?.thumbnail,
                  filePath: message.parent.metadata?.filePath,
                },
                user: userMap.get(message.parent.ownerId),
                parent: undefined,
              } as MessageWithUser)
            : undefined,
          metadata: {
            ...message.metadata,
            openGraphResult: message.metadata?.openGraphResult,
            originalFilename: message.metadata?.originalFilename,
            thumbnail: message.metadata?.thumbnail,
            filePath: message.metadata?.filePath,
          },
          user: userMap.get(message.ownerId),
        }) as MessageWithUser,
    );

    return messagesWithUser;
  }

  private async enrichMessageWithVocabulary(message: Message) {
    const vocabularyList =
      await this.vocabularyRepository.findVocabularyListById(message.content);

    return vocabularyList;
  }

  private async enrichMessageWithActivity(message: Message) {
    const activity = await this.activityRepository.ofId(message.content);

    return activity;
  }
}
