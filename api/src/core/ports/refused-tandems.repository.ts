import { RefusedTandem } from '../models/refused-tandem.model';

export const REFUSED_TANDEMS_REPOSITORY = 'refused-tandems.repository';

export interface RefusedTandemsRepository {
  save(item: RefusedTandem): Promise<void>;

  getAll(): Promise<RefusedTandem[]>;
}
