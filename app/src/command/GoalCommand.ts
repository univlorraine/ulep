import Goal from "../domain/entities/Goal";
import MediaObject from "../domain/entities/MediaObject";

interface GoalCommand {
    id: string;
    image?: { id: string; mimeType: string };
    name: string;
}

export const goalCommandToDomain = (command: GoalCommand) => {
    return new Goal(
        command.id,
        command.name,
        command.image ? new MediaObject(command.image.id, command.image.mimeType) : undefined
    );
};

export default GoalCommand;
