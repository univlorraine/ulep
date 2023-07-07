import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { DomainHttpAdapterInterface } from '../../adapter/DomainHttpAdapter';

interface LoginCommand {
    accessToken: string;
    refreshToken: string;
}

class LoginUsecase implements LoginUsecaseInterface {
    constructor(private readonly domainHttpAdapter: DomainHttpAdapterInterface, private readonly setTokens: Function) {}

    async execute(email: string, password: string): Promise<void | Error> {
        try {
            const httpRepsonse: HttpResponse<LoginCommand> = await this.domainHttpAdapter.post(
                '/authentication/token',
                { email, password }
            );

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.accessToken) {
                return new Error('errors.global');
            }

            return this.setTokens(httpRepsonse.parsedBody.accessToken, httpRepsonse.parsedBody.refreshToken);
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
