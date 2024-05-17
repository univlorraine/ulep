export type MessageType = 'text' | 'image' | 'audio' | 'file';

interface MessageProps {
    id: string;
    createdAt: Date;
    content: string;
    isReported: boolean;
    owner: string;
    type: MessageType;
    updatedAt: Date;
}

export class Message {
    readonly id: string;
    readonly content: string;
    readonly createdAt: Date;
    readonly isReported: boolean;
    readonly owner: string;
    readonly type: MessageType;
    readonly updatedAt: Date;

    constructor(props: MessageProps) {
        this.id = props.id;
        this.content = props.content;
        this.createdAt = props.createdAt;
        this.isReported = props.isReported;
        this.owner = props.owner;
        this.type = props.type;
        this.updatedAt = props.updatedAt;
    }
}
