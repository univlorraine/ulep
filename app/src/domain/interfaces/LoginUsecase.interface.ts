export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

interface LoginUsecaseInterface {
    execute(email: string, password: string): Promise<Tokens | Error>;
}
export default LoginUsecaseInterface;
