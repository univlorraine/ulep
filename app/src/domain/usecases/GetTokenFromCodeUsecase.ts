import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import GetTokenFromCodeUsecaseInterface, { Tokens } from "../interfaces/GetTokenFromCodeUsecase.interface";
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';

interface GetTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export class GetTokenFromCodeUsecase implements GetTokenFromCodeUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setTokens: Function) {}

    async execute(code: string): Promise<Tokens | Error> {
        try {
            const httpResponse: HttpResponse<GetTokenResponse> = await this.domainHttpAdapter.post(
                '/authentication/flow/code',
                {
                    code
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