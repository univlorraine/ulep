import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LogEntryType } from 'src/core/models/log-entry.model';
import {
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';
import { CreateOrUpdateLogEntryUsecase } from 'src/core/usecases/log-entry';

export class CreateVocabularyCommand {
  translation: string;
  vocabularyListId: string;
  ownerId: string;
  word: string;
}

@Injectable()
export class CreateVocabularyUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(CreateOrUpdateLogEntryUsecase)
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
  ) {}

  async execute(command: CreateVocabularyCommand) {
    const vocabularyList = await this.assertVocabularyListExist(
      command.vocabularyListId,
    );

    const vocabulary = await this.vocabularyRepository.createVocabulary({
      translation: command.translation,
      vocabularyListId: command.vocabularyListId,
      word: command.word,
    });

    await this.createOrUpdateLogEntryUsecase.execute({
      ownerId: command.ownerId,
      type: LogEntryType.ADD_VOCABULARY,
      metadata: {
        vocabularyListId: command.vocabularyListId,
        vocabularyListName: vocabularyList.name,
        entryNumber: 1,
      },
    });

    return vocabulary;
  }

  private async assertVocabularyListExist(id: string) {
    const vocabularyList =
      await this.vocabularyRepository.findVocabularyListById(id);

    if (!vocabularyList) {
      throw new RessourceDoesNotExist('Vocabulary list does not exist');
    }

    return vocabularyList;
  }
}
