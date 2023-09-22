import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ProfileCommand, { profileCommandToDomain } from '../../command/ProfileCommand';
import Profile from '../entities/Profile';
import GetProfileUsecaseInterface from '../interfaces/GetProfileUsecase.interface';

class GetProfileUsecase implements GetProfileUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    async execute(accessToken: string): Promise<Profile | Error> {
        try {
            //Force accessToken to avoid call with an old token ( because we have to wait store to be refreshed )
            const httpResponse: HttpResponse<ProfileCommand> = await this.domainHttpAdapter.get(
                `/profiles/me`,
                undefined,
                false,
                accessToken
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
