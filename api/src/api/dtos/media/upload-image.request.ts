import { IsImage } from '../../validators/images.validator';

export class UploadImageRequest {
  @IsImage({ mime: ['image/jpg', 'image/png', 'image/jpeg'] })
  file: Express.Multer.File;
}
