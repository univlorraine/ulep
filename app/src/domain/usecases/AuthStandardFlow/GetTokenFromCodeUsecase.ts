import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import GetTokenFromCodeUsecaseInterface, {
    GetTokenFromCodeParams,
} from '../../interfaces/AuthStandardFlow/GetTokenFromCodeUsecase.interface';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import Tokens from '../../entities/Tokens';

interface GetTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export class GetTokenFromCodeUsecase implements GetTokenFromCodeUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setTokens: Function) {}

    async execute({ code, redirectUri }: GetTokenFromCodeParams): Promise<Tokens | Error> {
        try {
            const httpResponse: HttpResponse<GetTokenResponse> = await this.domainHttpAdapter.post(
                '/authentication/flow/code',
                {
                    code,
                    // Note: redirectUri must be the same redirectUri used when initializing the flow
                    // otherwise an error will be thrown by auth server
                    redirectUri,
                },
                {},
                undefined,
                false
            );

            if (!httpResponse.ok && httpResponse.status === 401) {
                return new Error('errors.userWrongCredentials');
            }

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

            if (error.status === 404) {
                return new Error('errors.userDoesntExist');
            }

            return new Error('errors.global');
        }
    }
}
