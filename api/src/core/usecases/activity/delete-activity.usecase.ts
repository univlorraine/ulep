import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';
import {
  DeleteImageActivityUsecase,
  DeleteMediaActivityUsecase,
} from 'src/core/usecases/media';
import { DeleteVocabularyActivityUsecase } from './delete-vocabulary-activity.usecase';

@Injectable()
export class DeleteActivityUsecase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(DeleteVocabularyActivityUsecase)
    private readonly deleteVocabularyActivityUsecase: DeleteVocabularyActivityUsecase,
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
        await this.deleteVocabularyActivityUsecase.execute({
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
