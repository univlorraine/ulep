import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/core/models';
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
  contentFilter?: string;
  typeFilter?: string;
  direction?: ChatPaginationDirection;
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
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: GetMessagesFromConversationCommand) {
    const messagesCollection =
      await this.chatService.getMessagesFromConversationId(
        command.conversationId,
        command.limit,
        command.lastMessageId,
        command.contentFilter,
        command.typeFilter,
        command.direction,
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

        if (message.type === 'vocabulary') {
          message.metadata.vocabularyList =
            await this.enrichMessageWithVocabulary(message);
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
}
