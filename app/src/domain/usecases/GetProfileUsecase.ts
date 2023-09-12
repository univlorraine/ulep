import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ProfileCommand, { profileCommandToDomain } from '../../command/ProfileCommand';
import Profile from '../entities/Profile';
import GetProfileUsecaseInterface from '../interfaces/GetProfileUsecase.interface';

class GetProfileUsecase implements GetProfileUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    async execute(): Promise<Profile | Error> {
        try {
            const httpResponse: HttpResponse<ProfileCommand> = await this.domainHttpAdapter.get(
                `/profiles/me`,
                undefined,
                false
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return profileCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetProfileUsecase;
