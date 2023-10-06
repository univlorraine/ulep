export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface GetTokenFromCodeCommand {
    code: string;
    redirectUri: string;
}

interface GetTokenFromCodeUsecaseInterface {
    execute({
        code,
        redirectUri
    }: GetTokenFromCodeCommand): Promise<Tokens | Error>;
}

export default GetTokenFromCodeUsecaseInterface;
