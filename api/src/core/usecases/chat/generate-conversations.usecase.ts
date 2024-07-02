import { Inject, Injectable } from '@nestjs/common';
import { TandemStatus } from 'src/core/models';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';
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
  ) {}

  async execute() {
    const tandems = await this.tandemRepository.getExistingTandems();
    const users = await this.userRepository.findAll();

    const usersWithContact = users.items.filter((user) => user.contactId);

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

    usersWithContact.forEach(async (user) => {
      conversations.push({
        participants: [user.id, user.contactId],
      });
    });

    await this.chatService.createConversations(conversations);
  }
}
