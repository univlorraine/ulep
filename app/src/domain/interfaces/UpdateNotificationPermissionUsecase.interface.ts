interface UpdateNotificationPermissionUsecaseInterface {
    execute(notificationPermission: boolean): Promise<void | Error>;
}

export default UpdateNotificationPermissionUsecaseInterface;
