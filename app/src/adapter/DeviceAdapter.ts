import { Capacitor } from '@capacitor/core';
import DeviceAdapterInterface from './interfaces/DeviceAdapter.interface';

class DeviceAdapter implements DeviceAdapterInterface {
    isNativePlatform = () => Capacitor.isNativePlatform();
}

export default DeviceAdapter;
