import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UserResult, { userResultToDomain } from '../../command/UserResult';
import User from '../entities/User';
import GetUserUsecaseInterface from '../interfaces/GetUserUsecase.interface';

class GetUserUsecase implements GetUserUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    async execute(accessToken: string): Promise<User | Error> {
        try {
            //Force accessToken to avoid call with an old token ( because we have to wait store to be refreshed )
            const httpResponse: HttpResponse<UserResult> = await this.domainHttpAdapter.get(
                `/users/me`,
                {},
                false,
                accessToken
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return userResultToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetUserUsecase;
