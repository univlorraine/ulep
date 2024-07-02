import Conversation from '../../entities/chat/Conversation';

interface GetConversationsUsecaseInterface {
    execute(id: string): Promise<Conversation[] | Error>;
}
export default GetConversationsUsecaseInterface;
