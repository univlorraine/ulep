import { Collection } from '../../shared/types/collection';
import { Language } from '../models/language';
import { University } from '../models/university';

export interface UniversityRepository {
  ofId: (id: string) => Promise<University | null>;

  ofName: (name: string) => Promise<University | null>;

  addLanguage(language: Language, university: University): Promise<void>;

  removeLanguage(code: string, university: University): Promise<void>;

  create(university: University): Promise<void>;

  delete: (university: University) => Promise<void>;

  findAll: (offset?: number, limit?: number) => Promise<Collection<University>>;
}
