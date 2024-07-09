import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import CameraAdapterInterface from './interfaces/CameraAdapter.interface';

class CameraAdapter implements CameraAdapterInterface {
    getPictureFromGallery = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos,
        });

        if (image.webPath) {
            const response = await fetch(image.webPath);
            const blob = await response.blob();
            const file = new File([blob], 'avatar', { type: blob.type });
            return file;
        }

        return undefined;
    };

    checkPermissions = async () => {
        const res = await Camera.checkPermissions();
        await Camera.requestPermissions({ permissions: ['camera'] });
    };
}
export default CameraAdapter;
