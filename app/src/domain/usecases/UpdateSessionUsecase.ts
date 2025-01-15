import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import SessionCommand, { sessionCommandToDomain } from '../../command/SessionCommand';
import Session from '../entities/Session';
import UpdateSessionUsecaseInterface, { UpdateSessionCommand } from '../interfaces/UpdateSessionUsecase.interface';

class UpdateSessionUsecase implements UpdateSessionUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: UpdateSessionCommand): Promise<Session | Error> {
        try {
            const httpResponse: HttpResponse<SessionCommand> = await this.domainHttpAdapter.put(
                `/session/${command.id}`,
                {
                    startAt: command.startAt,
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

export default UpdateSessionUsecase;
