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
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class DeleteAudioVocabularyActivityCommand {
  vocabularyId: string;
}

@Injectable()
export class DeleteAudioVocabularyActivityUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
  ) {}

  async execute(command: DeleteAudioVocabularyActivityCommand) {
    const vocabulary = await this.tryToFindTheVocabularyOfId(
      command.vocabularyId,
    );

    if (vocabulary.pronunciationActivityVocabulary) {
      await this.deletePreviousSound(
        vocabulary.pronunciationActivityVocabulary,
      );
    }

    await this.activityRepository.deleteVocabulary(command.vocabularyId);
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

  private async deletePreviousSound(sound: MediaObject | null) {
    if (!sound) return;
    if (await this.storageInterface.fileExists(sound.bucket, sound.name)) {
      await this.storageInterface.delete(sound.bucket, sound.name);
      await this.mediaObjectRepository.remove(sound.id);
    }
  }
}
