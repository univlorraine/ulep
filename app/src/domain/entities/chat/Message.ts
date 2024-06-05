export enum MessageType {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    File = 'file',
}

export class MessageOwner {
    constructor(public readonly id: string, public readonly name: string, public readonly image?: string) {}
}

export class Message {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly conversationId: string,
        public readonly createdAt: Date,
        public readonly sender: MessageOwner,
        public readonly type: MessageType
    ) {}

    public isMine(userId: string): boolean {
        return this.sender.id === userId;
    }
}
