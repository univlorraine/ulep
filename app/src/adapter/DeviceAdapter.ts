import { Capacitor } from '@capacitor/core';
import DeviceAdapterInterface from './interfaces/DeviceAdapter.interface';

class DeviceAdapter implements DeviceAdapterInterface {
    isAndroid = () => Capacitor.getPlatform() === 'android';
    isIos = () => Capacitor.getPlatform() === 'ios';
    isNativePlatform = () => Capacitor.isNativePlatform();
}

export default DeviceAdapter;
