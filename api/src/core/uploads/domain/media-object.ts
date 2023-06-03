import { ContentTypeException } from 'src/shared/errors/content-type.exception';
import { v4 } from 'uuid';

export default class MediaObject {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly bucket: string,
    private readonly mimetype: string,
    private readonly size: number,
  ) { }

  static image(file: Express.Multer.File): MediaObject {
    const id = v4();
    const extension = this.getFileExtension(file.mimetype);
    const name = `${id}${extension}`;

    return new MediaObject(id, name, 'images', file.mimetype, file.size);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getBucket(): string {
    return this.bucket;
  }

  getMimetype(): string {
    return this.mimetype;
  }

  getSize(): number {
    return this.size;
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
      default:
        throw new ContentTypeException(contentType);
    }
  }
}
