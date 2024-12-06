import { v4 } from 'uuid';
import { ContentTypeException } from '../errors/content-type.exception';

export interface MediaObjectProps {
  id: string;
  name: string;
  bucket: string;
  mimetype: string;
  size: number;
}

const DEFAULT_BUCKET = 'images';

export class MediaObject {
  readonly id: string;

  readonly name: string;

  readonly bucket: string;

  readonly mimetype: string;

  readonly size: number;

  constructor(props: { id: string } & MediaObjectProps) {
    this.id = props.id;
    this.name = props.name;
    this.bucket = props.bucket;
    this.mimetype = props.mimetype;
    this.size = props.size;
  }

  static generate(
    file: Express.Multer.File,
    bucketName = DEFAULT_BUCKET,
    preferredId = undefined,
  ): MediaObject {
    const id = preferredId || v4();
    const name = this.getFileName(id, file.mimetype);

    return new MediaObject({
      id,
      name,
      bucket: bucketName,
      mimetype: file.mimetype,
      size: file.size,
    });
  }

  static getDefaultBucket() {
    return DEFAULT_BUCKET;
  }

  static getFileName(id: string, mimetype: string): string {
    const extension = this.getFileExtension(mimetype);
    return `${id}${extension}`;
  }

  private static getFileExtension(contentType: string): string {
    switch (contentType) {
      // image mime types
      case 'image/png':
        return '.png';
      case 'image/jpg':
        return '.jpg';
      case 'image/jpeg':
        return '.jpeg';
      case 'image/svg+xml':
        return '.svg';
      // audio mime types
      case 'audio/mpeg':
        return '.mp3';
      case 'audio/wav':
        return '.wav';
      case 'audio/ogg':
        return '.ogg';
      case 'audio/mp4':
        return '.mp4';
      // Document mime types
      case 'application/pdf':
        return '.pdf';
      case 'application/msword':
        return '.doc';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '.docx';
      case 'application/vnd.ms-powerpoint':
        return '.ppt';
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return '.pptx';
      case 'application/vnd.ms-excel':
        return '.xls';
      default:
        throw new ContentTypeException(contentType);
    }
  }
}
