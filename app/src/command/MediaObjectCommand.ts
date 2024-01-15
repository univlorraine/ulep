import MediaObject from "../domain/entities/MediaObject";

interface MediaObjectCommand {
    id: string;
    mimeType: string;
}

export const mediaObjectCommandToDomain = (command: MediaObjectCommand): MediaObject => {
    return new MediaObject(command.id, command.mimeType);
};

export default MediaObjectCommand;
