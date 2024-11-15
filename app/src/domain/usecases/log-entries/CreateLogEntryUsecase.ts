import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand } from '../../../command/ActivityCommand';
import CreateLogEntryUsecaseInterface, {
    CreateLogEntryProps,
} from '../../interfaces/log-entries/CreateLogEntryUsecase.interface';

class CreateLogEntryUsecase implements CreateLogEntryUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateLogEntryProps): Promise<void | Error> {
        try {
            const payload = {
                type: command.type,
            };
            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.post(
                `/log-entries`,
                payload
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateLogEntryUsecase;
