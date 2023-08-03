import { TextContent } from './translation.model';

export type LearningObjectiveProps = {
  id: string;
  name: TextContent;
};

export class LearningObjective {
  readonly id: string;
  readonly name: TextContent;

  constructor(props: LearningObjectiveProps) {
    this.id = props.id;
    this.name = props.name;
  }
}
