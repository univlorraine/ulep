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

export type ProficiencyTestProps = {
  id: string;
  level: ProficiencyLevel;
  questions: ProficiencyQuestion[];
};

export type ProficiencyQuestionProps = {
  id: string;
  text: TextContent;
  answer: boolean;
  level?: ProficiencyLevel;
};

export class ProficiencyTest {
  readonly id: string;
  readonly level: ProficiencyLevel;
  readonly questions: ProficiencyQuestion[];

  constructor(props: ProficiencyTestProps) {
    this.id = props.id;
    this.level = props.level;
    this.questions = props.questions;
  }
}

export class ProficiencyQuestion {
  readonly id: string;
  readonly text: TextContent;
  readonly answer: boolean;
  readonly level?: ProficiencyLevel;

  constructor(props: ProficiencyQuestionProps) {
    this.id = props.id;
    this.text = props.text;
    this.answer = props.answer;
    this.level = props.level;
  }
}
