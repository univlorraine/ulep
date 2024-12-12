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

    console.log(filteredActiveLanguages);

    for (const language of filteredActiveLanguages) {
      await this.createCommunityChatUsecase.execute({
        centralLanguageCode: language.code,
      });
    }
  }
}
