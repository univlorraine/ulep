import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import Tokens from '../entities/Tokens';
import LoginUsecaseInterface from '../interfaces/LoginUsecase.interface';

interface LoginCommand {
    accessToken: string;
    refreshToken: string;
}

class LoginUsecase implements LoginUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setTokens: Function) {}

    async execute(email: string, password: string): Promise<Tokens | Error> {
        try {
            const httpResponse: HttpResponse<LoginCommand> = await this.domainHttpAdapter.post(
                '/authentication/token',
                {
                    email,
                    password,
                },
                {},
                undefined,
                false
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.accessToken) {
                return new Error('errors.global');
            }

            const tokens = {
                accessToken: httpResponse.parsedBody.accessToken,
                refreshToken: httpResponse.parsedBody.refreshToken,
            };

            await this.setTokens(tokens);

            return tokens;
        } catch (error: any) {
            if (!error || !error.status || error.status === 401) {
                return new Error('errors.userWrongCredentials');
            }

            if (error.status === 404) {
                return new Error('errors.userDoesntExist');
            }

            return new Error('errors.global');
        }
    }
}

export default LoginUsecase;
