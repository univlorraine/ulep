import { UserChat } from '../User';
import { Message } from './Message';

class Conversation {
    constructor(
        public readonly id: string,
        public readonly participants: UserChat[],
        public readonly createdAt: Date,
        public readonly lastMessage?: Message,
        public readonly isBlocked: boolean = false
    ) {}

    /**
     * Get the main conversation partner.
     * If there is only one participant, return it -> University Contact.
     * If there are multiple participants, return the first one that is not an administrator -> Tandem Contact.
     */
    public static getMainConversationPartner(conversation: Conversation, userId: string): UserChat {
        const otherParticipants = conversation.participants.filter((participant) => participant.id !== userId);
        if (otherParticipants.length === 1) {
            return otherParticipants[0];
        }

        const tandemContact = otherParticipants.find((participant) => !participant.isAdministrator);
        if (tandemContact) {
            return tandemContact;
        }

        return otherParticipants[0];
    }
}

export default Conversation;
