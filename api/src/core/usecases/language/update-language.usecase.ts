import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Language, LanguageStatus } from 'src/core/models';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import { CreateCommunityChatUsecase } from 'src/core/usecases/chat';

export class UpdateLanguageCodeCommand {
  code: string;
  mainUniversityStatus?: LanguageStatus;
  secondaryUniversityActive?: boolean;
  isDiscovery?: boolean;
}

@Injectable()
export class UpdateLanguageCodeUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(CreateCommunityChatUsecase)
    private readonly createCommunityChatUsecase: CreateCommunityChatUsecase,
  ) {}

  async execute(command: UpdateLanguageCodeCommand) {
    const language = await this.languageRepository.ofCode(command.code);

    if (!language) {
      throw new RessourceDoesNotExist();
    }

    const updatedLanguage = await this.languageRepository.update(
      new Language({
        ...language,
        mainUniversityStatus:
          command.mainUniversityStatus ?? language.mainUniversityStatus,
        secondaryUniversityActive:
          command.secondaryUniversityActive ??
          language.secondaryUniversityActive,
        isDiscovery: command.isDiscovery ?? language.secondaryUniversityActive,
      }),
    );

    await this.handleCommunityChatCreation(command);

    return updatedLanguage;
  }

  private async handleCommunityChatCreation(
    command: UpdateLanguageCodeCommand,
  ) {
    if (command.mainUniversityStatus === LanguageStatus.PRIMARY) {
      await this.createCommunityChatUsecase.execute({
        centralLanguageCode: command.code,
      });
    }

    if (command.secondaryUniversityActive) {
      await this.createCommunityChatUsecase.execute({
        partnerLanguageCode: command.code,
      });
    }
  }
}
