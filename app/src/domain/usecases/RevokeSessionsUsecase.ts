import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import RevokeSessionsUsecaseInterface from '../interfaces/RevokeSessionsUsecase.interface';

class RevokeSessionsUsecase implements RevokeSessionsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<boolean | Error> {
        try {
            const httpResponse: HttpResponse<any> = await this.domainHttpAdapter.post('/users/revoke', {});

            if (!httpResponse.ok) {
                if (httpResponse.status === 401) {
                    return new Error('errors.userWrongCredentials');
                }

                return new Error('errors.global');
            }

            return true;
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

export default RevokeSessionsUsecase;
