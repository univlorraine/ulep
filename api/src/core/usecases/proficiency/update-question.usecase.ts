import { Inject, Injectable } from '@nestjs/common';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from '../../ports/proficiency.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import { ProficiencyLevel, Translation } from 'src/core/models';

export class UpdateQuestionCommand {
  id: string;
  level: ProficiencyLevel;
  value: string;
  translations?: Translation[];
  languageCode: string;
  answer: boolean;
}

@Injectable()
export class UpdateQuestionUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly proficiencyRepository: ProficiencyRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateQuestionCommand) {
    const question = await this.proficiencyRepository.questionOfId(command.id);

    if (!question) {
      throw new RessourceDoesNotExist();
    }

    const test = await this.proficiencyRepository.testOfLevel(command.level);
    if (!test) {
      throw new RessourceDoesNotExist();
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist();
    }

    return this.proficiencyRepository.updateQuestion({
      id: command.id,
      text: {
        id: question.text.id,
        content: command.value,
        language: command.languageCode,
        translations: command.translations,
      },
      answer: command.answer,
      level: command.level,
    });
  }
}
