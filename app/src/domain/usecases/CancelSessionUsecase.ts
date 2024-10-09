import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import SessionCommand, { sessionCommandToDomain } from '../../command/SessionCommand';
import Session from '../entities/Session';
import CancelSessionUsecaseInterface, { CancelSessionCommand } from '../interfaces/CancelSessionUsecase.interface';

class CancelSessionUsecase implements CancelSessionUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CancelSessionCommand): Promise<Session | Error> {
        try {
            const httpResponse: HttpResponse<SessionCommand> = await this.domainHttpAdapter.post(
                `/session/${command.id}/cancel`,
                {
                    comment: command.comment,
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

export default CancelSessionUsecase;
