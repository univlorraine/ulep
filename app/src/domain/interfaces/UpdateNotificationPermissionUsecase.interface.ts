interface UpdateNotificationPermissionUsecaseInterface {
    execute(id: string, notificationPermission: boolean): Promise<void | Error>;
}

export default UpdateNotificationPermissionUsecaseInterface;
