interface LoginUsecaseInterface {
    execute(email: string, password: string): Promise<any>;
}
