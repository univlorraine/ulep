export enum MessageType {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    File = 'file',
}

interface MessageProps {
    id: string;
    conversationId: string;
    content: string;
    isReported: boolean;
    ownerId: string;
    type: MessageType;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Message {
    readonly id: string;
    readonly content: string;
    readonly conversationId: string;
    readonly isReported: boolean;
    readonly ownerId: string;
    readonly type: MessageType;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(props: MessageProps) {
        this.id = props.id;
        this.content = props.content;
        this.conversationId = props.conversationId;
        this.createdAt = props.createdAt;
        this.isReported = props.isReported;
        this.ownerId = props.ownerId;
        this.type = props.type;
        this.updatedAt = props.updatedAt;
    }

    public static categorizeFileType(mimeType?: string): MessageType {
        if (!mimeType) {
            return MessageType.Text;
        } else if (mimeType.startsWith('audio/')) {
            return MessageType.Audio;
        } else if (mimeType.startsWith('image/')) {
            return MessageType.Image;
        } else {
            return MessageType.File;
        }
    }
}
