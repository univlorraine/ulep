type CustomLearningGoalProps = {
  id: string;
  title: string;
  description: string;
  learningLanguageId: string;
};

export class CustomLearningGoal {
  readonly id: string;

  readonly title: string;

  readonly description: string;

  readonly learningLanguageId: string;

  constructor(props: CustomLearningGoalProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.learningLanguageId = props.learningLanguageId;
  }
}
