import { Inject, Injectable } from '@nestjs/common';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from '../../ports/proficiency.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from '../../ports/uuid.provider';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import { ProficiencyLevel, Translation } from 'src/core/models';

export class CreateQuestionCommand {
  level: ProficiencyLevel;
  value: string;
  translations?: Translation[];
  languageCode: string;
  answer: boolean;
}

@Injectable()
export class CreateQuestionUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly proficiencyRepository: ProficiencyRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateQuestionCommand) {
    const test = await this.proficiencyRepository.testOfLevel(command.level);
    if (!test) {
      throw new RessourceDoesNotExist();
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist();
    }

    return this.proficiencyRepository.createQuestion(test.id, {
      id: this.uuidProvider.generate(),
      text: {
        id: this.uuidProvider.generate(),
        content: command.value,
        language: command.languageCode,
        translations: command.translations,
      },
      answer: command.answer,
    });
  }
}
