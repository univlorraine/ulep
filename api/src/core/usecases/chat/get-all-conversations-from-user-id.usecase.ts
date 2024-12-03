import { Collection } from '@app/common';
import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { TandemStatus, User } from 'src/core/models';
import {
  ChatServicePort,
  CHAT_SERVICE,
  ConversationWithUsers,
  MessageWithUser,
} from 'src/core/ports/chat.service';
import {
  ProfileQueryWhere,
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';

export class GetAllConversationsFromUserIdCommand {
  userId: string;
  limit: number;
  offset: number;
  filters: ProfileQueryWhere;
}

@Injectable()
export class GetAllConversationsFromUserIdUsecase {
  constructor(
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatServicePort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    private readonly keycloakClient: KeycloakClient,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetAllConversationsFromUserIdCommand) {
    const hasFilter =
      command.filters.user.firstname.contains ||
      command.filters.user.lastname.contains;

    let filteredProfilesList: string[] = [];

    if (hasFilter) {
      const profiles = await this.profileRepository.findAll(
        undefined,
        undefined,
        undefined,
        command.filters,
      );

      const filteredProfilesIds = new Set<string>();
      profiles.items.forEach((profile) => {
        filteredProfilesIds.add(profile.user.id);
      });

      filteredProfilesList = Array.from(filteredProfilesIds);
    }

    // We then get corresponding conversations from Chat
    const conversationsCollection =
      await this.chatService.getAllConversationsFromUserId(
        command.userId,
        command.limit,
        command.offset,
        filteredProfilesList.length > 0 ? filteredProfilesList : undefined,
      );

    if (
      !conversationsCollection ||
      !conversationsCollection.totalItems ||
      conversationsCollection.totalItems === 0
    ) {
      return new Collection<ConversationWithUsers>({
        items: [],
        totalItems: 0,
      });
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

    const tandems = await this.tandemRepository.ofIds(
      conversations.map((conversation) => conversation.id),
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
    const updatedConversations = conversations
      .map(
        (conversation) =>
          ({
            ...conversation,
            users: conversation.usersIds.map((id) => userMap.get(id)),
            metadata: {
              isBlocked:
                tandems.find((tandem) => tandem.id === conversation.id)
                  ?.status === TandemStatus.PAUSED,
              learningLanguages: tandems.find(
                (tandem) => tandem.id === conversation.id,
              )?.learningLanguages,
            },
            lastMessage: conversation.lastMessage
              ? ({
                  ...conversation.lastMessage,
                  user: userMap.get(conversation.lastMessage.ownerId),
                } as MessageWithUser)
              : undefined,
            lastActivityAt: conversation.lastActivity,
          }) as ConversationWithUsers,
      )
      .filter((conversation) =>
        conversation.users.every((user) => user !== undefined),
      );

    return new Collection<ConversationWithUsers>({
      items: updatedConversations,
      totalItems: conversationsCollection.totalItems,
    });
  }
}
