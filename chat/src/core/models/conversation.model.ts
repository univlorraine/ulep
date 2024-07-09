import { Message } from 'src/core/models/message.model';

interface ConversationProps {
    id: string;
    createdAt: Date;
    usersIds: string[];
    lastActivity: Date;
    lastMessage?: Message;
    metadata: any;
}

export class Conversation {
    readonly id: string;
    readonly createdAt: Date;
    readonly usersIds: string[];
    readonly lastActivity: Date;
    readonly lastMessage?: Message;
    readonly metadata: any;

    constructor(props: ConversationProps) {
        this.id = props.id;
        this.createdAt = props.createdAt;
        this.usersIds = props.usersIds;
        this.lastActivity = props.lastActivity;
        this.lastMessage = props.lastMessage;
        this.metadata = props.metadata;
    }
}
