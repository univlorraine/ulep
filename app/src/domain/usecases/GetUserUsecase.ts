import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UserCommand, { userCommandToDomain } from '../../command/UserCommand';
import User from '../entities/User';
import GetUserUsecaseInterface from '../interfaces/GetUserUsecase.interface';

class GetUserUsecase implements GetUserUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    async execute(accessToken: string): Promise<User | Error> {
        try {
            //Force accessToken to avoid call with an old token ( because we have to wait store to be refreshed )
            const httpResponse: HttpResponse<UserCommand> = await this.domainHttpAdapter.get(
                `/users/me`,
                {},
                false,
                accessToken
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return userCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetUserUsecase;
