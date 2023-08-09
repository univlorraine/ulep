import Goal from '../domain/entities/Goal';

interface GoalCommand {
    id: string;
    image: string;
    name: string;
}

export const goalCommandToDomain = (command: GoalCommand) => {
    return new Goal(command.id, command.name, command.image);
};

export default GoalCommand;
