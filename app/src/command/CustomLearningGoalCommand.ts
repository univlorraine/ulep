import CustomLearningGoal from '../domain/entities/CustomLearningGoal';

interface CustomLearningGoalCommand {
    id: string;
    title: string;
    description: string;
}

export const customLearningGoalCommandToDomain = (command: CustomLearningGoalCommand) => {
    return new CustomLearningGoal(
        command.id,
        command.title,
        command.description,
    );
};

export default CustomLearningGoalCommand;
