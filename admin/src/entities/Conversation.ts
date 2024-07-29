import User from './User';

export type Conversation = {
    id: string;
    partner: User;
    lastMessage?: Message;
};

export type Message = {
    id: string;
    content: string;
    createdAt: string;
};
