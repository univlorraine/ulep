import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LogEntryType } from 'src/core/models/log-entry.model';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';
import { CreateOrUpdateLogEntryUsecase } from 'src/core/usecases/log-entry';

export class UpdateVocabularyListCommand {
  vocabularyListId: string;
  name?: string;
  symbol?: string;
  profileIds?: string[];
}

@Injectable()
export class UpdateVocabularyListUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(CreateOrUpdateLogEntryUsecase)
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
  ) {}

  async execute(command: UpdateVocabularyListCommand) {
    const oldVocabularyList = await this.assertVocabularyListExist(
      command.vocabularyListId,
    );

    await Promise.all(
      command.profileIds.map((profileId) => this.assertProfileExist(profileId)),
    );

    const vocabularyList = await this.vocabularyRepository.updateVocabularyList(
      {
        id: command.vocabularyListId,
        name: command.name ?? oldVocabularyList.name,
        symbol: command.symbol ?? oldVocabularyList.symbol,
        profileIds: command.profileIds,
      },
    );

    if (command.profileIds && command.profileIds.length > 0) {
      await this.createOrUpdateLogEntryUsecase.execute({
        ownerId: vocabularyList.creatorId,
        type: LogEntryType.SHARE_VOCABULARY,
        metadata: { vocabularyListId: command.vocabularyListId },
      });
    }

    return vocabularyList;
  }

  private async assertVocabularyListExist(id: string) {
    const vocabularyList =
      await this.vocabularyRepository.findVocabularyListById(id);

    if (!vocabularyList) {
      throw new RessourceDoesNotExist('Vocabulary list does not exist');
    }

    return vocabularyList;
  }

  private async assertProfileExist(profileId: string) {
    const profile = await this.profileRepository.ofId(profileId);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }
}
