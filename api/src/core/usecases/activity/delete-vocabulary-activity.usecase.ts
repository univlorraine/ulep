import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';
import {
  DeleteAudioVocabularyActivityUsecase,
  DeleteImageActivityUsecase,
  DeleteMediaActivityUsecase,
} from 'src/core/usecases/media';

@Injectable()
export class DeleteVocabularyActivityUsecase {
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

  async execute({ vocabularyId }: { vocabularyId: string }) {
    const activityVocabulary =
      await this.activityRepository.ofVocabularyId(vocabularyId);
    if (!activityVocabulary) {
      throw new RessourceDoesNotExist();
    }

    await this.deleteAudioVocabularyActivityUsecase.execute({
      vocabularyId,
    });

    await this.activityRepository.deleteVocabulary(vocabularyId);
  }
}
