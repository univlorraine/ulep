export const CHAT_SERVICE = 'chat.service';

//TODO: Change any to a proper type
export interface ChatServicePort {
  createConversation(
    users: string[],
    tandemId?: string,
    metadata?: any,
  ): Promise<any>;
  deleteConversation(tandemId: string): Promise<any>;
}
