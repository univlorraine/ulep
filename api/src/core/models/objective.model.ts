import { TextContent } from './translation.model';

export type LearningObjectiveProps = {
  id: string;
  name: TextContent;
};

// TODO: Add image (svg)
export class LearningObjective {
  readonly id: string;
  readonly name: TextContent;

  constructor(props: LearningObjectiveProps) {
    this.id = props.id;
    this.name = props.name;
  }
}
