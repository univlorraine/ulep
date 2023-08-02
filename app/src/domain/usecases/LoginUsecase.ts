import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import LoginUsecaseInterface from '../interfaces/LoginUsecase.interface';

interface LoginCommand {
    accessToken: string;
    refreshToken: string;
}

class LoginUsecase implements LoginUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setTokens: Function) {}

    async execute(email: string, password: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<LoginCommand> = await this.domainHttpAdapter.post(
                '/authentication/token',
                {
                    email,
                    password,
                }
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.accessToken) {
                return new Error('errors.global');
            }

            return this.setTokens(httpResponse.parsedBody.accessToken, httpResponse.parsedBody.refreshToken);
        } catch (error: any) {
            if (!error || !error.status) {
                return new Error('errors.global');
            }

            if (error.status === 401) {
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
