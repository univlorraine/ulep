import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

export class AddUserToCommunityChatCommand {
  profileId?: string;
  learningLanguageId?: string;
}

@Injectable()
export class AddUserToCommunityChatUsecase {
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

  async execute(command: AddUserToCommunityChatCommand) {
    const profile = await this.assertProfileExists(command.profileId);
    const learningLanguage = await this.assertLearningLanguageExists(
      command.learningLanguageId,
    );
    const masteredLanguages = profile.masteredLanguages.map(
      (language) => language.code,
    );

    const allProfilesLanguagesCodes = [
      ...masteredLanguages,
      profile.nativeLanguage.code,
    ];

    for (const languageCode of allProfilesLanguagesCodes) {
      const communityChat = await this.assertCommunityChatExists(
        learningLanguage.code,
        languageCode,
      );

      if (communityChat) {
        await this.chatService.addUserToConversation(
          communityChat.id,
          profile.user.id,
        );
      }
    }
  }

  private async assertProfileExists(profileId: string) {
    const profile = await this.profileRepository.ofId(profileId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  private async assertLearningLanguageExists(learningLanguageId: string) {
    const learningLanguage =
      await this.languageRepository.ofId(learningLanguageId);
    if (!learningLanguage) {
      throw new NotFoundException('Learning language not found');
    }

    return learningLanguage;
  }

  private async assertCommunityChatExists(
    learningLanguageCode: string,
    masteredLanguageCode: string,
  ) {
    const communityChat =
      await this.communityChatRepository.findByLanguageCodes(
        learningLanguageCode,
        masteredLanguageCode,
      );

    return communityChat;
  }
}
