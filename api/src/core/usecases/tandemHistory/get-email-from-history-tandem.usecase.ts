import { Inject, Injectable } from '@nestjs/common';
import {
  TANDEM_HISTORY_REPOSITORY,
  TandemHistoryRepository,
} from 'src/core/ports/tandem-history.repository';

export class GetOtherUserEmailInTandemUsecaseCommand {
  languageId: string;
  userId: string;
}

@Injectable()
export class GetOtherUserEmailInTandemUsecase {
  constructor(
    @Inject(TANDEM_HISTORY_REPOSITORY)
    private readonly tandemHistoryRepository: TandemHistoryRepository,
  ) {}

  async execute(command: GetOtherUserEmailInTandemUsecaseCommand) {
    const tandemHistory =
      await this.tandemHistoryRepository.getHistoryTandemFormUserIdAndLanguageId(
        command.userId,
        command.languageId,
      );

    if (!tandemHistory) {
      return undefined;
    }

    return await this.tandemHistoryRepository.getOtherUserInTandemHistory(
      command.userId,
      tandemHistory.tandemId,
    );
  }
}
