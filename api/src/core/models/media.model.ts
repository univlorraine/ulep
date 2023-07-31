import { v4 } from 'uuid';
import { ContentTypeException } from '../errors/content-type.exception';

export interface MediaObjectProps {
  id: string;
  name: string;
  bucket: string;
  mimetype: string;
  size: number;
}

export class MediaObject {
  #id: string;
  #name: string;
  #bucket: string;
  #mimetype: string;
  #size: number;

  constructor(props: { id: string } & MediaObjectProps) {
    this.#id = props.id;
    this.#name = props.name;
    this.#bucket = props.bucket;
    this.#mimetype = props.mimetype;
    this.#size = props.size;
  }

  static image(file: Express.Multer.File): MediaObject {
    const id = v4();
    const extension = this.getFileExtension(file.mimetype);
    const name = `${id}${extension}`;

    return new MediaObject({
      id,
      name,
      bucket: 'images',
      mimetype: file.mimetype,
      size: file.size,
    });
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get bucket(): string {
    return this.#bucket;
  }

  get mimetype(): string {
    return this.#mimetype;
  }

  get size(): number {
    return this.#size;
  }

  get url(): string {
    return `${process.env.MINIO_PUBLIC_URL}/${this.bucket}/${this.name}`;
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
