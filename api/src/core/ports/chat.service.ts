export const CHAT_SERVICE = 'chat.service';

//TODO: Change any to a proper type
export interface ChatServicePort {
  createConversation(
    tandemId: string,
    users: string[],
    metadata?: any,
  ): Promise<any>;
  deleteConversation(tandemId: string): Promise<any>;
}
