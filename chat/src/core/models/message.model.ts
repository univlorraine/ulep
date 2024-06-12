import { Owner } from 'src/core/models/owner.model';

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
    owner: Owner;
    type: MessageType;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Message {
    readonly id: string;
    readonly content: string;
    readonly conversationId: string;
    readonly isReported: boolean;
    readonly owner: Owner;
    readonly type: MessageType;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(props: MessageProps) {
        this.id = props.id;
        this.content = props.content;
        this.conversationId = props.conversationId;
        this.createdAt = props.createdAt;
        this.isReported = props.isReported;
        this.owner = props.owner;
        this.type = props.type;
        this.updatedAt = props.updatedAt;
    }
}
