import { HistorizedTandem } from '../models/historized-tandem.model';

export const TANDEM_HISTORY_REPOSITORY = 'tandem-history.repository';

export interface TandemHistoryRepository {
  getHistoryTandemFormUserIdAndLanguageId(
    userId: string,
    languageId: string,
  ): Promise<HistorizedTandem>;
  getOtherUserInTandemHistory(
    userId: string,
    tandemHistoryId: string,
  ): Promise<HistorizedTandem>;
  getHistorizedTandemForUser(userId: string): Promise<HistorizedTandem[]>;
  update(userId: string, email: string): Promise<void>;
}
