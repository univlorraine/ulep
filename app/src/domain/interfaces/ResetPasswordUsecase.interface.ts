interface ResetPasswordUsecaseInterface {
    execute(email: string): Promise<void | Error>;
}
export default ResetPasswordUsecaseInterface;
