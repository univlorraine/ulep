interface DeviceAdapterInterface {
    isAndroid: () => boolean;
    isIos: () => boolean;
    isNativePlatform: () => boolean;
}

export default DeviceAdapterInterface;
