import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand } from '../../../command/ActivityCommand';
import { LogEntryType } from '../../entities/LogEntry';
import CreateLogEntryUsecaseInterface, {
    CreateLogEntryProps,
} from '../../interfaces/log-entries/CreateLogEntryUsecase.interface';

interface CreateLogEntryPayload {
    type: LogEntryType;
    content?: string;
    duration?: number;
    tandemFirstname?: string;
    tandemLastname?: string;
    percentage?: number;
    title?: string;
    createdAt?: Date;
}

class CreateLogEntryUsecase implements CreateLogEntryUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateLogEntryProps): Promise<void | Error> {
        try {
            const payload: CreateLogEntryPayload = {
                type: command.type,
            };

            if (command.metadata.content) {
                payload.content = command.metadata.content;
            }

            if (command.metadata.duration) {
                payload.duration = command.metadata.duration;
            }

            if (command.metadata.tandemFirstname) {
                payload.tandemFirstname = command.metadata.tandemFirstname;
            }

            if (command.metadata.tandemLastname) {
                payload.tandemLastname = command.metadata.tandemLastname;
            }

            if (command.metadata.percentage) {
                payload.percentage = command.metadata.percentage;
            }

            if (command.metadata.title) {
                payload.title = command.metadata.title;
            }

            if (command.createdAt) {
                payload.createdAt = command.createdAt;
            }

            if (command.metadata.date) {
                payload.createdAt = command.metadata.date;
            }

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
