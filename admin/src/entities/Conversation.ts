import User from './User';

export type Conversation = {
    id: string;
    partner: User;
    lastMessage?: Message;
};

type Message = {
    id: string;
    content: string;
    createdAt: string;
};
