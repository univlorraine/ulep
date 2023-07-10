interface ResetPasswordUsecaseInterface {
    execute(id: string, password: string): Promise<void | Error>;
}
export default ResetPasswordUsecaseInterface;
