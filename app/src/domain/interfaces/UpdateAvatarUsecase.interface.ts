interface UpdateAvatarUsecaseInterface {
    execute(avatar: File): Promise<string | Error>;
}

export default UpdateAvatarUsecaseInterface;
