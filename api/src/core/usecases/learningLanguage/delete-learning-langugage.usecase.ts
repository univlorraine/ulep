import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguageIsAlreadyInActiveTandemError } from 'src/core/errors/tandem-exceptions';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';

export class DeleteLearningLanguageCommand {
  id: string;
}

@Injectable()
export class DeleteLearningLanguageUsecase {
  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(command: DeleteLearningLanguageCommand) {
    const learningLangugage = await this.learningLanguageRepository.ofId(
      command.id,
    );

    if (!learningLangugage) {
      throw new RessourceDoesNotExist();
    }

    await this.assertLearningLanguageIsNotInActiveTandem(learningLangugage.id);

    return this.learningLanguageRepository.delete(learningLangugage.id);
  }

  private async assertLearningLanguageIsNotInActiveTandem(id: string) {
    const hasActiveTandem =
      await this.learningLanguageRepository.hasAnActiveTandem(id);

    if (hasActiveTandem) {
      throw new LearningLanguageIsAlreadyInActiveTandemError(id);
    }
  }
}
