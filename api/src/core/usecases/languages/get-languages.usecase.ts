import { Inject, Injectable } from '@nestjs/common';
import { LanguageRepository } from '../../ports/language.repository';
import { LANGUAGE_REPOSITORY } from '../../../providers/providers.module';

export class GetLanguagesCommand {
  page: number;
  limit: number;
}

@Injectable()
export class GetLanguagesUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: GetLanguagesCommand) {
    const { page, limit } = command;
    const offset = (page - 1) * limit;

    const result = await this.languageRepository.all(offset, limit);

    return result;
  }
}
