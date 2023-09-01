import { Collection } from '@app/common';
import { University } from '../models';

export const UNIVERSITY_REPOSITORY = 'university.repository';

export interface UniversityRepository {
  create(university: University): Promise<University>;

  findAll(): Promise<Collection<University>>;

  findUniversityCentral(): Promise<University>;

  havePartners(id: string): Promise<boolean>;

  ofId(id: string): Promise<University | null>;

  ofName(name: string): Promise<University | null>;

  update(university: University): Promise<University>;

  remove(id: string): Promise<void>;
}
