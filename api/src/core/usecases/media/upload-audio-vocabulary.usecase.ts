import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { MediaObject } from 'src/core/models/media.model';
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
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class UploadAudioVocabularyCommand {
  file: File;
  vocabularyId: string;
  isTranslation: boolean;
}

@Injectable()
export class UploadAudioVocabularyUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
  ) {}

  async execute(command: UploadAudioVocabularyCommand) {
    const vocabulary = await this.tryToFindTheVocabularyOfId(
      command.vocabularyId,
    );

    const audio = await this.upload(
      vocabulary,
      command.file,
      command.isTranslation,
    );

    const url = this.storageInterface.temporaryUrl(
      audio.bucket,
      audio.name,
      60 * 60 * 24 * 7,
    );

    return url;
  }

  private async upload(
    vocabulary: Vocabulary,
    file: Express.Multer.File,
    isTranslation: boolean,
  ): Promise<MediaObject> {
    const sound = new MediaObject({
      id: vocabulary.id,
      name: MediaObject.getFileName(vocabulary.id, file.mimetype),
      bucket: 'vocabulary',
      mimetype: file.mimetype,
      size: file.size,
    });

    const previousVocabulary =
      await this.tryToFindTheVocabularyAudioTranslation(
        vocabulary,
        isTranslation,
      );
    if (previousVocabulary) {
      await this.deletePreviousSound(previousVocabulary);
    }
    await this.deletePreviousSound(sound);
    await this.storageInterface.write(sound.bucket, sound.name, file);
    await this.mediaObjectRepository.saveAudioVocabulary(
      vocabulary.id,
      isTranslation,
      sound,
    );
    return sound;
  }

  private async tryToFindTheVocabularyOfId(id: string): Promise<Vocabulary> {
    const vocabulary = await this.vocabularyRepository.findVocabularyById(id);
    if (!vocabulary) {
      throw new UnauthorizedOperation();
    }

    return vocabulary;
  }

  private tryToFindTheVocabularyAudioTranslation(
    vocabulary: Vocabulary,
    isTranslation: boolean,
  ): Promise<MediaObject | null> {
    return this.mediaObjectRepository.audioTranslatedOfVocabulary(
      vocabulary.id,
      isTranslation,
    );
  }

  private async deletePreviousSound(sound: MediaObject | null) {
    if (!sound) return;
    if (await this.storageInterface.fileExists(sound.bucket, sound.name)) {
      await this.storageInterface.delete(sound.bucket, sound.name);
      await this.mediaObjectRepository.remove(sound.id);
    }
  }
}
