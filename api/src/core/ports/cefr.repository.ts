import { CEFRLevel, CEFRTest } from '../models/cefr';

export interface CEFRRepository {
  testOfLevel(level: CEFRLevel): Promise<CEFRTest>;
}
