import User from "../entities/User";

interface UpdateNotificationPermissionUsecaseInterface {
    execute(id: string, notificationPermission: boolean): Promise<User | Error>;
}

export default UpdateNotificationPermissionUsecaseInterface;
