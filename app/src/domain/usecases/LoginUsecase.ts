import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import DomainHttpAdapter from '../../adapter/DomainHttpAdapter';

interface LoginCommand {
    accessToken: string;
    refreshToken: string;
}

class LoginUsecase implements LoginUsecaseInterface {
    constructor(private readonly domainHttpAdapter: DomainHttpAdapter, private readonly setTokens: Function) {}

    async execute(email: string, password: string): Promise<void> {
        try {
            const httpRepsonse: HttpResponse<LoginCommand> = await this.domainHttpAdapter.post(
                '/authentication/token',
                { email, password }
            );

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.accessToken) {
                throw new Error('errors.global');
            }

            return this.setTokens(httpRepsonse.parsedBody.accessToken, httpRepsonse.parsedBody.refreshToken);
        } catch (error: any) {
            if (!error || !error.status) {
                throw new Error('errors.global');
            }

            if (error.status === 401) {
                throw new Error('errors.userWrongCredentials');
            }

            if (error.status === 404) {
                throw new Error('errors.userDoesntExist');
            }

            throw new Error('errors.global');
        }
    }
}

export default LoginUsecase;
