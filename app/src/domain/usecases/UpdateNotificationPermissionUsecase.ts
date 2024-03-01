import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UpdateNotificationPermissionUsecaseInterface from '../interfaces/UpdateNotificationPermissionUsecase.interface';

class UpdateNotificationPermissionUsecase implements UpdateNotificationPermissionUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, notificationPermission: boolean): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<undefined> = await this.domainHttpAdapter.put(`/users/${id}`, {
                acceptsEmail: notificationPermission,
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

export default UpdateNotificationPermissionUsecase;
