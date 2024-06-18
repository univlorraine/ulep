import User from '../User';
import { Message } from './Message';

class Conversation {
    constructor(
        public readonly id: string,
        public readonly lastMessage: Message,
        public readonly participants: User[],
        public readonly createdAt: Date
    ) {}
}

export default Conversation;
