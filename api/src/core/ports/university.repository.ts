import { Collection } from 'src/shared/types/collection';
import { University } from '../models/university';

export interface UniversityRepository {
  ofId: (id: string) => Promise<University | null>;

  ofName: (name: string) => Promise<University | null>;

  save: (university: University) => Promise<void>;

  delete: (university: University) => Promise<void>;

  findAll: (offset?: number, limit?: number) => Promise<Collection<University>>;
}
