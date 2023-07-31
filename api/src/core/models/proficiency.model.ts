import { TextContent } from './translation.model';

export enum ProficiencyLevel {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export class ProficiencyTest {
  id: string;
  level: ProficiencyLevel;
  questions: ProficiencyQuestion[];
}

export class ProficiencyQuestion {
  id: string;
  text: TextContent;
  answer: boolean;
}
