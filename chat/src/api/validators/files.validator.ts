import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

export type FileOptions = {
    maxSize?: number;
};

export class FilePipe extends ParseFilePipe {
    constructor(options?: FileOptions) {
        const sizeValidator = new MaxFileSizeValidator({
            maxSize: options?.maxSize ?? 10000000,
        });

        super({
            validators: [sizeValidator],
        });
    }

    transform(value: any) {
        if (!value) return value;

        return super.transform(value);
    }
}
