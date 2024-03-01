import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { userResultToDomain } from '../../command/UserResult';
import User from '../entities/User';
import UpdateNotificationPermissionUsecaseInterface from '../interfaces/UpdateNotificationPermissionUsecase.interface';

class UpdateNotificationPermissionUsecase implements UpdateNotificationPermissionUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, notificationPermission: boolean): Promise<User | Error> {
        try {
            const httpResponse: HttpResponse<undefined> = await this.domainHttpAdapter.patch(`/users/${id}`, {
                acceptsEmail: notificationPermission,
            });

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return userResultToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateNotificationPermissionUsecase;
