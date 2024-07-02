interface GetJitsiTokenUsecaseInterface {
    execute(accessToken: string): Promise<{ token: string } | Error>;
}
export default GetJitsiTokenUsecaseInterface;
