import CustomLearningGoal from "../entities/CustomLearningGoal";

export type CreateCustomLearningGoalCommand = {
    title: string;
    description: string;
    learningLanguageId: string;
};

interface CreateCustomLearningGoalUsecaseInterface {
    execute(command: CreateCustomLearningGoalCommand): Promise<CustomLearningGoal[] | Error>;
}

export default CreateCustomLearningGoalUsecaseInterface;
