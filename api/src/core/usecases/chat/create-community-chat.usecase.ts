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
