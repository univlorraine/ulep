import { Collection } from '../../shared/types/collection';
import { Tandem } from '../models/tandem';

export interface TandemsRepository {
  create(tandem: Tandem): Promise<void>;

  hasActiveTandem(profileId: string): Promise<boolean>;

  findAllActiveTandems(
    offset?: number,
    limit?: number,
  ): Promise<Collection<Tandem>>;
}
