import { Inject, Injectable } from '@nestjs/common';
import { LanguageRepository } from '../../ports/language.repository';
import { LANGUAGE_REPOSITORY } from '../../../providers/providers.module';
import { LanguageDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';

export class AddLanguageRequestCommand {
  code: string;
  userId: string;
}

@Injectable()
export class AddLanguageRequestUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(
    command: AddLanguageRequestCommand,
  ): Promise<{ code: string; count: number }> {
    await this.assertLanguageExistForCode(command.code);

    await this.languageRepository.addRequest(command.code, command.userId);

    const count = await this.languageRepository.countRequests(command.code);

    return {
      code: command.code,
      count,
    };
  }

  private async assertLanguageExistForCode(code: string): Promise<void> {
    const language = await this.languageRepository.ofCode(code);

    if (!language) {
      throw LanguageDoesNotExist.withCodeOf(code);
    }
  }
}
