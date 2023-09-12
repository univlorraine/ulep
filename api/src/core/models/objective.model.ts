import { MediaObject } from 'src/core/models/media.model';
import { TextContent } from './translation.model';

export type LearningObjectiveProps = {
  id: string;
  image?: MediaObject;
  name: TextContent;
};

export class LearningObjective {
  readonly id: string;
  readonly image?: MediaObject;
  readonly name: TextContent;

  constructor(props: LearningObjectiveProps) {
    this.id = props.id;
    this.image = props.image;
    this.name = props.name;
  }
}
