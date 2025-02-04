import { Inject, Injectable } from '@nestjs/common';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';

export class GetLanguageCommand {
  id: string;
}

@Injectable()
export class GetLanguageUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: GetLanguageCommand) {
    return await this.languageRepository.ofId(command.id);
  }
}
