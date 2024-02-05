import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguageIsAlreadyInActiveTandemError } from 'src/core/errors/tandem-exceptions';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';

export class DeleteLearningLanguageCommand {
  id: string;
}

@Injectable()
export class DeleteLearningLanguageUsecase {
  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  async execute(command: DeleteLearningLanguageCommand) {
    const learningLangugage = await this.learningLanguageRepository.ofId(
      command.id,
    );

    if (!learningLangugage) {
      throw new RessourceDoesNotExist();
    }

    await this.assertLearningLanguageIsNotInActiveTandem(learningLangugage.id);

    await this.tandemRepository.deleteTandemLinkedToLearningLanguages([
      learningLangugage.id,
    ]);

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
