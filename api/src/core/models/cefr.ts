export enum CEFRLevel {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export interface CEFRTest {
  id: string;
  level: CEFRLevel;
  questions: CEFRQuestion[];
}

export interface CEFRQuestion {
  id: string;
  value: string;
  answer: boolean;
}
