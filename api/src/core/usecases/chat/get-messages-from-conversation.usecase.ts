import { Inject, Injectable } from '@nestjs/common';
import {
  CHAT_SERVICE,
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
  messageFilter?: string;
}

@Injectable()
export class GetMessagesFromConversationUsecase {
  constructor(
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatServicePort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetMessagesFromConversationCommand) {
    const messagesCollection =
      await this.chatService.getMessagesFromConversationId(
        command.conversationId,
        command.limit,
        command.lastMessageId,
        command.messageFilter,
      );

    if (messagesCollection && messagesCollection.totalItems === 0) {
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
    const userMap = new Map(users.map((user) => [user.id, user]));
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
