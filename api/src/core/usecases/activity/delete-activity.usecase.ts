import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from 'src/core/ports/activity.repository';
import {
  DeleteAudioVocabularyActivityUsecase,
  DeleteImageActivityUsecase,
  DeleteMediaActivityUsecase,
} from 'src/core/usecases/media';

@Injectable()
export class DeleteActivityUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(DeleteAudioVocabularyActivityUsecase)
    private readonly deleteAudioVocabularyActivityUsecase: DeleteAudioVocabularyActivityUsecase,
    @Inject(DeleteImageActivityUsecase)
    private readonly deleteImageActivityUsecase: DeleteImageActivityUsecase,
    @Inject(DeleteMediaActivityUsecase)
    private readonly deleteMediaActivityUsecase: DeleteMediaActivityUsecase,
  ) {}

  async execute(id: string) {
    const activity = await this.activityRepository.ofId(id);
    if (!activity) {
      throw new RessourceDoesNotExist();
    }

    await Promise.all(
      activity.activityVocabularies.map(async (vocabulary) => {
        await this.deleteAudioVocabularyActivityUsecase.execute({
          vocabularyId: vocabulary.id,
        });
      }),
    );

    if (activity.ressourceFile) {
      await this.deleteMediaActivityUsecase.execute({
        activityId: activity.id,
      });
    }

    await this.deleteImageActivityUsecase.execute({
      activityId: activity.id,
    });

    await Promise.all(
      activity.activityExercises.map(async (exercise) => {
        await this.activityRepository.deleteExercise(exercise.id);
      }),
    );

    return this.activityRepository.deleteActivity(id);
  }
}
