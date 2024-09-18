import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { ActivityVocabulary } from 'src/core/models/activity.model';
import { MediaObject } from 'src/core/models/media.model';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class UploadAudioVocabularyActivityCommand {
  file: File;
  vocabularyId: string;
}

@Injectable()
export class UploadAudioVocabularyActivityUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
  ) {}

  async execute(command: UploadAudioVocabularyActivityCommand) {
    const vocabulary = await this.tryToFindTheVocabularyOfId(
      command.vocabularyId,
    );

    const audio = await this.upload(vocabulary, command.file);

    const url = this.storageInterface.temporaryUrl(
      audio.bucket,
      audio.name,
      60 * 60 * 24 * 7,
    );

    return url;
  }

  private async upload(
    vocabulary: ActivityVocabulary,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const sound = new MediaObject({
      id: `${vocabulary.id}`,
      name: MediaObject.getFileName(vocabulary.id, file.mimetype),
      bucket: 'vocabulary',
      mimetype: file.mimetype,
      size: file.size,
    });

    const previousVocabulary =
      await this.tryToFindTheVocabularyAudioTranslation(vocabulary);
    if (previousVocabulary) {
      await this.deletePreviousSound(previousVocabulary);
    }
    await this.deletePreviousSound(sound);

    await this.storageInterface.write(sound.bucket, sound.name, file);

    await this.mediaObjectRepository.saveAudioVocabularyActivity(
      vocabulary.id,
      sound,
    );

    return sound;
  }

  private async tryToFindTheVocabularyOfId(
    id: string,
  ): Promise<ActivityVocabulary> {
    const vocabulary = await this.activityRepository.ofVocabularyId(id);
    if (!vocabulary) {
      throw new UnauthorizedOperation();
    }

    return vocabulary;
  }

  private tryToFindTheVocabularyAudioTranslation(
    vocabulary: ActivityVocabulary,
  ): Promise<MediaObject | null> {
    return this.mediaObjectRepository.audioTranslatedOfVocabularyActivity(
      vocabulary.id,
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
