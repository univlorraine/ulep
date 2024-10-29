import CustomLearningGoal from "../entities/CustomLearningGoal";

export type UpdateCustomLearningGoalCommand = {
    id: string;
    title: string;
    description: string;
};

interface UpdateCustomLearningGoalUsecaseInterface {
    execute(command: UpdateCustomLearningGoalCommand): Promise<CustomLearningGoal[] | Error>;
}

export default UpdateCustomLearningGoalUsecaseInterface;
