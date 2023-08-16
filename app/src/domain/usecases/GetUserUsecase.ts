import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UserCommand, { userCommandToDomain } from '../../command/UserCommand';
import User from '../entities/User';
import GetUserUsecaseInterface from '../interfaces/GetUserUsecase.interface';

class GetUserUsecase implements GetUserUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    async execute(): Promise<User | Error> {
        try {
            const httpResponse: HttpResponse<UserCommand> = await this.domainHttpAdapter.get(
                `/users/me`,
                undefined,
                false
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
