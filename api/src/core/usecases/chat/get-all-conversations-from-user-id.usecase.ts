import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { User } from 'src/core/models';
import {
  CHAT_SERVICE,
  ChatServicePort,
  ConversationWithUsers,
  MessageWithUser,
} from 'src/core/ports/chat.service';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

export class GetAllConversationsFromUserIdCommand {
  userId: string;
  limit: number;
  offset: number;
}

@Injectable()
export class GetAllConversationsFromUserIdUsecase {
  constructor(
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatServicePort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: GetAllConversationsFromUserIdCommand) {
    const conversationsCollection =
      await this.chatService.getAllConversationsFromUserId(
        command.userId,
        command.limit,
        command.offset,
      );

    if (conversationsCollection.totalItems === 0) {
      return [];
    }

    const conversations = conversationsCollection.items;

    // Get all userIds from conversations and last messages
    const allUserIds = new Set();
    conversations.forEach((conversation) => {
      conversation.usersIds.forEach((id) => allUserIds.add(id));
      if (conversation.lastMessage && conversation.lastMessage.ownerId) {
        allUserIds.add(conversation.lastMessage.ownerId);
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
      const userDetails = await this.keycloakClient.getUserById(id);
      if (userDetails) {
        userMap.set(id, userDetails);
      } else {
        throw new RessourceDoesNotExist(`User not found with id: ${id}`);
      }
    }

    // Replace userIds by user objects in conversations
    const updatedConversations = conversations.map(
      (conversation) =>
        ({
          ...conversation,
          users: conversation.usersIds.map((id) => userMap.get(id)),
          lastMessage: conversation.lastMessage
            ? ({
                ...conversation.lastMessage,
                user: userMap.get(conversation.lastMessage.ownerId),
              } as MessageWithUser)
            : undefined,
        } as ConversationWithUsers),
    );

    return updatedConversations;
  }
}
