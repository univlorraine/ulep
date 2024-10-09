import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import SessionCommand, { sessionCommandToDomain } from '../../command/SessionCommand';
import Session from '../entities/Session';
import CreateSessionUsecaseInterface, { CreateSessionCommand } from '../interfaces/CreateSessionUsecase.interface';

class CreateSessionUsecase implements CreateSessionUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateSessionCommand): Promise<Session | Error> {
        try {
            const httpResponse: HttpResponse<SessionCommand> = await this.domainHttpAdapter.post(
                `/session/`,
                {
                    startAt: command.startAt,
                    comment: command.comment,
                    tandemId: command.tandemId,
                },
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            const session = sessionCommandToDomain(httpResponse.parsedBody);

            return session;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateSessionUsecase;
