import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { Vocabulary } from 'src/core/models/vocabulary.model';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';
import {
  VOCABULARY_REPOSITORY,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class DeleteAudioVocabularyCommand {
  vocabularyId: string;
  isTranslation: boolean;
}

@Injectable()
export class DeleteAudioVocabularyUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
  ) {}

  async execute(command: DeleteAudioVocabularyCommand) {
    const vocabulary = await this.tryToFindTheVocabularyOfId(
      command.vocabularyId,
    );

    const name = `${vocabulary.id}-${
      command.isTranslation ? 'translation' : 'word'
    }`;
    if (await this.storageInterface.fileExists('vocabulary', `${name}.wav`)) {
      await this.storageInterface.delete('vocabulary', `${name}.wav`);
      await this.mediaObjectRepository.remove(name);
    }
  }

  private async tryToFindTheVocabularyOfId(id: string): Promise<Vocabulary> {
    const vocabulary = await this.vocabularyRepository.findVocabularyById(id);
    if (!vocabulary) {
      throw new UnauthorizedOperation();
    }

    return vocabulary;
  }
}
