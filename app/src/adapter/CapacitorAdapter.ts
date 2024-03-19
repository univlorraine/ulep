import { Capacitor } from '@capacitor/core';
import CapacitorAdapterInterface from './interfaces/CapacitorAdapter.interface';

class CapacitorAdapter implements CapacitorAdapterInterface {
    isNativePlatform =  () => Capacitor.isNativePlatform()
}

export default CapacitorAdapter;
