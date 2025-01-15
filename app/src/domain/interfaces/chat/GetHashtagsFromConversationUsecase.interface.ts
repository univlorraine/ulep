import Hashtag from '../../entities/chat/Hashtag';

interface GetHastagsFromConversationUsecaseInterface {
    execute(conversationId: string): Promise<Hashtag[] | Error>;
}

export default GetHastagsFromConversationUsecaseInterface;
