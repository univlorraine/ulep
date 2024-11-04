import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import UnsubscribeToEventUsecaseInterface from '../../interfaces/event/UnsubscribeToEventUsecase.interface';

class UnsubscribeToEventUsecase implements UnsubscribeToEventUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(eventId: string, profileId: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<void> = await this.domainHttpAdapter.post(
                `/events/${eventId}/unsubscribe`,
                {
                    profilesIds: [profileId],
                }
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

export default UnsubscribeToEventUsecase;
