import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export type ImagesFileOptions = {
  maxSize?: number;
  fileType?: string | RegExp;
};

export class ImagesFilePipe extends ParseFilePipe {
  constructor(options?: ImagesFileOptions) {
    const sizeValidator = new MaxFileSizeValidator({
      maxSize: options?.maxSize ?? 1000000,
    });

    const mimeValidator = new FileTypeValidator({
      fileType: options?.fileType ?? RegExp('^(image/(jpg|png|jpeg))$'),
    });

    super({
      validators: [sizeValidator, mimeValidator],
    });
  }
}
