import User from './User';

export type Conversation = {
    id: string;
    partner: User;
    lastMessage?: Message;
    isBlocked: boolean;
};

export type Message = {
    id: string;
    content: string;
    createdAt: string;
};
