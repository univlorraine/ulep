interface RevokeSessionsUsecaseInterface {
    execute(): Promise<boolean | Error>;
}

export default RevokeSessionsUsecaseInterface;
