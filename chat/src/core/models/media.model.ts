import { v4 } from 'uuid';

export interface MediaObjectProps {
    id: string;
    name: string;
    bucket: string;
    mimetype: string;
    size: number;
}

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
        bucketName = 'chat',
        conversationId: string,
        fileName?: string,
    ): MediaObject {
        const id = v4();
        const extension = file.mimetype;
        const name = `${conversationId}/${
            fileName ? fileName : `${id}.${extension.split('/')[1]}`
        }`;

        return new MediaObject({
            id,
            name,
            bucket: bucketName,
            mimetype: file.mimetype,
            size: file.size,
        });
    }
}
