import Tokens from '../../entities/Tokens';

export interface GetTokenFromCodeParams {
    code: string;
    redirectUri: string;
}

interface GetTokenFromCodeUsecaseInterface {
    execute({ code, redirectUri }: GetTokenFromCodeParams): Promise<Tokens | Error>;
}

export default GetTokenFromCodeUsecaseInterface;
