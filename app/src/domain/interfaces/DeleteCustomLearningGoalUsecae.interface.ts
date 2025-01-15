import CustomLearningGoal from "../entities/CustomLearningGoal";

export type DeleteCustomLearningGoalCommand = {
    id: string;
};

interface DeleteCustomLearningGoalUsecaseInterface {
    execute(command: DeleteCustomLearningGoalCommand): Promise<CustomLearningGoal[] | Error>;
}

export default DeleteCustomLearningGoalUsecaseInterface;
