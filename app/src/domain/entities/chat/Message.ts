import { UserMessage } from '../User';

export enum MessageType {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    File = 'file',
}

export class Message {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly conversationId: string,
        public readonly createdAt: Date,
        public readonly sender: UserMessage,
        public readonly type: MessageType
    ) {}

    public isMine(userId: string): boolean {
        return this.sender.id === userId;
    }
}
