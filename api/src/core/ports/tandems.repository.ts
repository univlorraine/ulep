import { Collection } from '@app/common';
import { Tandem } from '../models';

export const TANDEM_REPOSITORY = 'tandem.repository';

export interface TandemsRepository {
  save(tandem: Tandem): Promise<void>;

  hasActiveTandem(profileId: string): Promise<boolean>;

  findAllActiveTandems(
    offset?: number,
    limit?: number,
  ): Promise<Collection<Tandem>>;
}
