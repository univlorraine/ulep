import { UserChat } from '../User';
import { differenceInCalendarDays, format, isToday, isYesterday } from 'date-fns';

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
        const now = new Date();
        if (isToday(this.createdAt)) {
            // If the date is today, return the time
            return 'date.today';
        } else if (isYesterday(this.createdAt)) {
            // If the date is yesterday, return 'Yesterday'
            return 'date.yesterday';
        } else {
            const daysDifference = differenceInCalendarDays(now, this.createdAt);
            if (daysDifference < 7) {
                // If the date is less than 7 days, return the day of the week
                return `days.${format(this.createdAt, 'EEEE').toLowerCase()}`;
            } else {
                // If the date is not today or yesterday, return the date in the format 'dd/MM'
                return format(this.createdAt, 'dd/MM');
            }
        }
    }

    public getMessageHour(): string {
        return format(this.createdAt, 'HH:mm');
    }
}
