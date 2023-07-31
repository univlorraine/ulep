import { Language, University } from '../models';

export const UNIVERSITY_REPOSITORY = 'university.repository';

export interface UniversityRepository {
  create(university: University): Promise<University>;

  findAll(): Promise<University[]>;

  findUniversityCentral(): Promise<University | null>;

  findPartners(): Promise<University[]>;

  ofId(id: string): Promise<University | null>;

  ofName(name: string): Promise<University | null>;

  languages(id: string): Promise<Language[]>;

  addLanguage(language: Language, university: University): Promise<void>;

  removeLanguage(language: Language, university: University): Promise<void>;

  update(id: string, name: string): Promise<void>;

  remove(id: string): Promise<void>;
}
