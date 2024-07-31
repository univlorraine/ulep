export enum MessageType {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    File = 'file',
    Link = 'link',
}

interface MessageProps {
    id: string;
    conversationId: string;
    content: string;
    isReported: boolean;
    isDeleted: boolean;
    ownerId: string;
    type: MessageType;
    createdAt?: Date;
    updatedAt?: Date;
    metadata?: any;
}

export class Message {
    readonly id: string;
    content: string;
    readonly conversationId: string;
    readonly isReported: boolean;
    readonly isDeleted: boolean;
    readonly ownerId: string;
    readonly type: MessageType;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly metadata?: any;

    constructor(props: MessageProps) {
        this.id = props.id;
        this.content = props.content;
        this.conversationId = props.conversationId;
        this.createdAt = props.createdAt;
        this.isReported = props.isReported;
        this.isDeleted = props.isDeleted;
        this.ownerId = props.ownerId;
        this.type = props.type;
        this.updatedAt = props.updatedAt;
        this.metadata = props.metadata;
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
