import { Collection } from '@app/common';
import { Campus } from 'src/core/models/campus.model';

export const CAMPUS_REPOSITORY = 'campus.repository';

export interface CampusRepository {
  all(): Promise<Collection<Campus>>;

  ofId(id: string): Promise<Campus | null>;

  create(campus: Campus): Promise<Campus>;

  update(campus: Campus): Promise<Campus>;

  delete(id: string): Promise<void>;
}
