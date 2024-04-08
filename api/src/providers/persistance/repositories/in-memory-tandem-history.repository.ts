import { Injectable } from '@nestjs/common';
import { HistorizedTandem } from 'src/core/models/historized-tandem.model';
import { TandemHistoryRepository } from 'src/core/ports/tandem-history.repository';

@Injectable()
export class InMemoryTandemHistoryRepository
  implements TandemHistoryRepository
{
  #tandemsHistory: HistorizedTandem[] = [];

  init(tandemsHistory: HistorizedTandem[]): void {
    this.#tandemsHistory = tandemsHistory;
  }

  reset(): void {
    this.#tandemsHistory = [];
  }

  save(tandemHistory: HistorizedTandem): Promise<void> {
    this.#tandemsHistory.push(tandemHistory);

    return Promise.resolve();
  }

  getHistoryTandemFormUserIdAndLanguageId(
    userId: string,
    languageId: string,
  ): Promise<HistorizedTandem> {
    return Promise.resolve(
      this.#tandemsHistory.find(
        (tandem) =>
          tandem.userId === userId && tandem.language.id === languageId,
      ),
    );
  }

  getOtherUserInTandemHistory(
    userId: string,
    tandemHistoryId: string,
  ): Promise<HistorizedTandem> {
    return Promise.resolve(
      this.#tandemsHistory.find(
        (tandem) =>
          tandem.id === tandemHistoryId && tandem.language.id !== userId,
      ),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHistorizedTandemForUser(userId: string): Promise<HistorizedTandem[]> {
    throw new Error('Not implemented');
  }

  update(userId: string, email: string): Promise<void> {
    this.#tandemsHistory.forEach((tandem) => {
      if (tandem.userId === userId) {
        tandem.userEmail = email;
      }
    });

    return Promise.resolve();
  }
}
