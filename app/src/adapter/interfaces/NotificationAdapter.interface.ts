interface NotificationAdapterInterface {
    errorListener(callback: Function): void;
    notificationActionListener(callback: Function): void;
    notificationPermission(): Promise<void>;
    notificationReceivedListener(callback: Function): void;
    registrationListener(callback: Function): void;
    removeListeners(): void;
}

export default NotificationAdapterInterface;
