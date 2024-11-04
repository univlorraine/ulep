import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { EventCommand, eventCommandToDomain } from '../../../command/EventCommand';
import EventObject from '../../entities/Event';
import GetEventUsecaseInterface from '../../interfaces/event/GetEventUsecase.interface';

class GetEventUsecase implements GetEventUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(eventId: string): Promise<EventObject | Error> {
        try {
            const httpResponse: HttpResponse<EventCommand> = await this.domainHttpAdapter.get(`/events/${eventId}`);

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return eventCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetEventUsecase;
