import MediaObject from "../entities/MediaObject";

interface UpdateAvatarUsecaseInterface {
    execute(avatar: File): Promise<MediaObject | Error>;
}

export default UpdateAvatarUsecaseInterface;
