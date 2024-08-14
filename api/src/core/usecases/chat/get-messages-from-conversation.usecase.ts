import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/core/models';
import {
  CHAT_SERVICE,
  ChatPaginationDirection,
  ChatServicePort,
  MessageWithUser,
} from 'src/core/ports/chat.service';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

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

    // Get all userIds from conversations and last messages
    const allUserIds = new Set();
    messages.forEach((message) => {
      if (message.ownerId) {
        allUserIds.add(message.ownerId);
      }
    });

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
            openGraphResult: message.metadata?.openGraphResult,
            originalFilename: message.metadata?.originalFilename,
          },
          user: userMap.get(message.ownerId),
        } as MessageWithUser),
    );

    return messagesWithUser;
  }
}
