import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';

@Injectable()
export class GetActivityUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
  ) {}

  async execute(id: string) {
    const activity = await this.activityRepository.ofId(id);

    console.log({ activity });

    if (!activity) {
      throw new RessourceDoesNotExist();
    }

    if (activity.image) {
      const imageUrl = await this.storage.temporaryUrl(
        activity.image.bucket,
        activity.image.name,
        3600,
      );
      activity.imageUrl = imageUrl;
    }

    if (activity.ressourceFile) {
      const fileUrl = await this.storage.temporaryUrl(
        activity.ressourceFile.bucket,
        activity.ressourceFile.name,
        3600,
      );
      activity.ressourceFileUrl = fileUrl;
    }

    for (const vocabulary of activity.activityVocabularies) {
      if (vocabulary.pronunciationActivityVocabulary) {
        const audioUrl = await this.storage.temporaryUrl(
          vocabulary.pronunciationActivityVocabulary.bucket,
          vocabulary.pronunciationActivityVocabulary.name,
          3600,
        );
        vocabulary.pronunciationActivityVocabularyUrl = audioUrl;
      }
    }

    return activity;
  }
}
