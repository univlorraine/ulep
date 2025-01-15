import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import SubscribeToEventUsecaseInterface from '../../interfaces/event/SubscribeToEventUsecase.interface';

class SubscribeToEventUsecase implements SubscribeToEventUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(eventId: string, profileId: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<void> = await this.domainHttpAdapter.post(`/events/${eventId}/subscribe`, {
                profilesIds: [profileId],
            });

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default SubscribeToEventUsecase;
