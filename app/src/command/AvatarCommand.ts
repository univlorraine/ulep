import MediaObject from "../domain/entities/MediaObject";

interface AvatarCommand {
    id: string;
    mimeType: string;
    url: string;
}

export const avatarCommandToDomain = (command: AvatarCommand) => {
    return new MediaObject(command.id, command.mimeType, command.url);
};

export default AvatarCommand;
