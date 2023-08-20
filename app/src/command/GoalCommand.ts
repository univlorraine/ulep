import Goal from "../domain/entities/Goal";

interface GoalCommand {
    id: string;
    image?: { id: string; url: string };
    name: string;
}

export const goalCommandToDomain = (command: GoalCommand) => {
    return new Goal(
        command.id,
        command.name,
        command.image ? command.image.url : undefined
    );
};

export default GoalCommand;
