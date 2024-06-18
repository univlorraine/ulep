import { UserChat } from '../User';
import { Message } from './Message';

class Conversation {
    constructor(
        public readonly id: string,
        public readonly participants: UserChat[],
        public readonly createdAt: Date,
        public readonly lastMessage?: Message
    ) {}
}

export default Conversation;
