import { differenceInCalendarDays, format, isToday, isYesterday } from 'date-fns';
import { UserChat } from '../User';
import VocabularyList from '../VocabularyList';

export enum MessageType {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    File = 'file',
    Link = 'link',
    Vocabulary = 'vocabulary',
}

interface MessageMetadata {
    originalFilename: string;
    filePath?: string;
    openGraphResult: any;
    thumbnail?: string;
    vocabularyList?: VocabularyList;
}

export class MessageWithoutSender {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly senderId: string,
        public readonly type: MessageType,
        public likes: number = 0,
        public didLike: boolean = false,
        public readonly metadata: MessageMetadata
    ) {}

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

    public isMine(userId: string): boolean {
        return this.senderId === userId;
    }

    public getThumbnail(): string | undefined {
        if (this.type === MessageType.Image) {
            return this.metadata.thumbnail ?? this.content;
        }
        return undefined;
    }
}

export class Message extends MessageWithoutSender {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly sender: UserChat,
        public readonly type: MessageType,
        public likes: number = 0,
        public didLike: boolean = false,
        public readonly metadata: MessageMetadata
    ) {
        super(id, content, createdAt, sender.id, type, likes, didLike, metadata);
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
        public likes: number = 0,
        public didLike: boolean = false,
        public readonly metadata: any
    ) {
        super(id, content, createdAt, sender, type, likes, didLike, metadata);
    }
}
