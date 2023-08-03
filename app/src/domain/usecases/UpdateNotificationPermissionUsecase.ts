import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UpdateNotificationPermissionUsecaseInterface from '../interfaces/UpdateNotificationPermissionUsecase.interface';

class UpdateNotificationPermissionUsecase implements UpdateNotificationPermissionUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(notificationPermission: boolean): Promise<void | Error> {
        try {
            //TODO: Change this
            /*
            const httpResponse: HttpResponse<undefined> = await this.domainHttpAdapter.put(`/users`, {
                notificationPermission,
            });

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
*/
            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateNotificationPermissionUsecase;
