import { Collection } from '@app/common';
import { Tandem, TandemStatus } from '../models';

export const TANDEM_REPOSITORY = 'tandem.repository';

export type FindWhereProps = {
  status?: TandemStatus;
  profileId?: string;
  offset?: number;
  limit?: number;
};

export interface TandemRepository {
  save(tandem: Tandem): Promise<void>;

  hasActiveTandem(profileId: string): Promise<boolean>;

  findWhere(props: FindWhereProps): Promise<Collection<Tandem>>;

  getExistingTandems(): Promise<Tandem[]>;
}
