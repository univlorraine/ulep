/* eslint-disable max-classes-per-file */
import { differenceInCalendarDays, format, isToday, isYesterday } from 'date-fns';

export enum MessagePaginationDirection {
    BACKWARD = 'backward',
    FORWARD = 'forward',
    BOTH = 'both',
}

class MediaObject {
    constructor(
        public readonly id: string,
        public readonly mimeType: string
    ) {}
}

export class UserChat {
    constructor(
        public readonly id: string,
        public readonly firstname: string,
        public readonly lastname: string,
        public readonly email: string,
        public readonly isAdministrator: boolean,
        public readonly avatar?: MediaObject
    ) {}
}

export enum MessageType {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    File = 'file',
    Link = 'link',
}

interface MessageMetadata {
    originalFilename: string;
    openGraphResult: any;
}

export class MessageWithoutSender {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly senderId: string,
        public readonly type: MessageType,
        public readonly metadata: MessageMetadata
    ) {}

    public getMessageDate(): string {
        const now = new Date();
        if (isToday(this.createdAt)) {
            // If the date is today, return the time
            return 'date.today';
        }
        if (isYesterday(this.createdAt)) {
            // If the date is yesterday, return 'Yesterday'
            return 'date.yesterday';
        }
        const daysDifference = differenceInCalendarDays(now, this.createdAt);
        if (daysDifference < 7) {
            // If the date is less than 7 days, return the day of the week
            return `days.${format(this.createdAt, 'EEEE').toLowerCase()}`;
        }

        // If the date is not today or yesterday, return the date in the format 'dd/MM'
        return format(this.createdAt, 'dd/MM');
    }

    public getMessageHour(): string {
        return format(this.createdAt, 'HH:mm');
    }

    public isMine(userId: string): boolean {
        return this.senderId === userId;
    }
}

export class Message extends MessageWithoutSender {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly sender: UserChat,
        public readonly type: MessageType,
        public readonly metadata: MessageMetadata
    ) {
        super(id, content, createdAt, sender.id, type, metadata);
    }
}

export class MessageWithConversationId extends Message {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly sender: UserChat,
        public readonly type: MessageType,
        public readonly conversationId: string,
        public readonly metadata: any
    ) {
        super(id, content, createdAt, sender, type, metadata);
    }
}
