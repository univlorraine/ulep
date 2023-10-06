// TODO: factorize
export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

interface GetTokenFromCodeUsecaseInterface {
    execute(code: string): Promise<Tokens | Error>;
}

export default GetTokenFromCodeUsecaseInterface;
