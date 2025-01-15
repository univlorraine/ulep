import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguage, MediaObject } from 'src/core/models';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';

export class UpdateLearningLanguageCommand {
  learningJournal?: boolean;
  consultingInterview?: boolean;
  sharedCertificate?: boolean;
  certificateFile?: MediaObject;
}

@Injectable()
export class UpdateLearningLanguageUsecase {
  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
  ) {}

  async execute(
    id: string,
    command: UpdateLearningLanguageCommand,
  ): Promise<LearningLanguage> {
    const learningLanguage = await this.learningLanguageRepository.ofId(id);

    if (!learningLanguage) {
      throw new RessourceDoesNotExist();
    }

    const newLearningLanguage = new LearningLanguage({
      ...learningLanguage,
      ...command,
    });

    await this.learningLanguageRepository.update(newLearningLanguage);

    return newLearningLanguage;
  }
}
