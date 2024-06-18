import { UserChat } from '../User';
import { format, isToday, isYesterday } from 'date-fns';

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
        public readonly createdAt: Date,
        public readonly sender: UserChat,
        public readonly type: MessageType
    ) {}

    public isMine(userId: string): boolean {
        return this.sender.id === userId;
    }

    public getMessageDate(): string {
        if (isToday(this.createdAt)) {
            // If the date is today, return the time
            return format(this.createdAt, 'HH:mm');
        } else if (isYesterday(this.createdAt)) {
            // If the date is yesterday, return 'Yesterday'
            return 'date.yesterday';
        } else {
            // If the date is not today or yesterday, return the date in the format 'dd/MM'
            return format(this.createdAt, 'dd/MM');
        }
    }
}
