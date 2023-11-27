import Purge from '../models/purge.model';

export const PURGE_REPOSITORY = 'purge.repository';

export interface PurgeRepository {
  create(id: string, author: string): Promise<Purge>;

  ofId(id: string): Promise<Purge>;

  all(): Promise<Purge[]>;
}
