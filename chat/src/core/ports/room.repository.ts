export const ROOM_REPOSITORY = 'room.repository';

export type Room = { conversationId: string; participants: string[] };

export type User = { userId: string; socketId: string };

export abstract class RoomRepositoryInterface {
    abstract findConversationsWithParticipants(): Promise<Room[]>;

    abstract findParticipantsByConversationId(
        conversationId: string,
    ): Promise<Room | null>;
}
