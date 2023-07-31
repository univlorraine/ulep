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
            return image.webPath;
        }
        return image.path;
    };
}

export default CameraAdapter;
