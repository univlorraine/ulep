import { Collection } from '@app/common';
import { Tandem, TandemStatus } from '../models';

export const TANDEM_REPOSITORY = 'tandem.repository';

export type FindWhereProps = {
  status?: TandemStatus;
  offset?: number;
  limit?: number;
};

export interface TandemRepository {
  save(tandem: Tandem): Promise<void>;

  saveMany(tandems: Tandem[]): Promise<void>;

  ofId(id: string): Promise<Tandem>;

  updateStatus(id: string, status: TandemStatus): Promise<void>;

  findWhere(props: FindWhereProps): Promise<Collection<Tandem>>;

  getExistingTandems(): Promise<Tandem[]>;

  getTandemsForProfile(profileId: string): Promise<Tandem[]>;

  getTandemForLearningLanguage(learningLanguageId: string): Promise<Tandem>;

  deleteTandemNotLinkedToLearningLangues(): Promise<number>;

  deleteTandemLinkedToLearningLanguages(
    learningLanguagesIds: string[],
  ): Promise<number>;
}
