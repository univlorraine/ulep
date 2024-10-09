import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import SessionCommand, { sessionCommandToDomain } from '../../command/SessionCommand';
import Session from '../entities/Session';
import GetAllSessionsUsecaseInterface from '../interfaces/GetAllSessionsUsecase.interface';

class GetAllSessionsUsecase implements GetAllSessionsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<Session[] | Error> {
        try {
            const httpResponse: HttpResponse<SessionCommand[]> = await this.domainHttpAdapter.get(
                `/profiles/${id}/sessions`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.map(sessionCommandToDomain);
            
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllSessionsUsecase;
