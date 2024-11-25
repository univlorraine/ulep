import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand } from '../../../command/ActivityCommand';
import { GameName, LogEntryType } from '../../entities/LogEntry';
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
    gameName?: GameName;
    title?: string;
    createdAt?: Date;
    partnerTandemId?: string;
}

class CreateLogEntryUsecase implements CreateLogEntryUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateLogEntryProps): Promise<void | Error> {
        try {
            const payload: CreateLogEntryPayload = {
                type: command.type,
            };

            console.log('command', command);

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

            if (command.metadata.partnerTandemId) {
                payload.partnerTandemId = command.metadata.partnerTandemId;
            }

            if (command.metadata.percentage !== undefined) {
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

            if (command.metadata.gameName) {
                payload.gameName = command.metadata.gameName;
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
