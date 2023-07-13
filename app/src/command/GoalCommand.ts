import Goal from '../domain/entities/Goal';

interface GoalCommand {
    id: string;
    description: string;
    image: string;
}

export const goalCommandToDomain = (command: GoalCommand) => {
    return new Goal(command.id, command.description, command.image);
};

export default GoalCommand;
