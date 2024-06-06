import { RedisService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { RoomRepositoryInterface, Room } from 'src/core/ports/room.repository';

// Topics are stored at conversation:{conversation} with User IDs.
// Users are stored as user:{userId} which returns the socketId for quicker access.
@Injectable()
export class RedisRoomService implements RoomRepositoryInterface {
    constructor(private readonly redis: RedisService) {}

    // Add user to a conversation
    async addUserToTopic(conversation: string, userId: string): Promise<void> {
        await this.redis.client.sAdd(`conversation:${conversation}`, userId);
    }

    // Remove user from a conversation
    async removeUserFromTopic(
        conversation: string,
        userId: string,
    ): Promise<void> {
        await this.redis.client.sRem(`conversation:${conversation}`, userId);
    }

    // Remove user from all conversations
    async removeUserFromAllTopics(userId: string): Promise<void> {
        const conversationKeys = await this.redis.client.keys('conversation:*');

        for (const key of conversationKeys) {
            await this.redis.client.sRem(key, userId);
        }
    }

    // Save user's socket ID
    async setUserSocketId(userId: string, socketId: string): Promise<void> {
        await this.redis.client.set(`user:${userId}`, socketId);
    }

    // Fetch user socketID using their userID
    async getUserSocketId(userId: string): Promise<string | null> {
        return await this.redis.client.get(`user:${userId}`);
    }

    // Delete a user's socket ID
    async deleteUserSocketId(userId: string): Promise<void> {
        await this.redis.client.del(`user:${userId}`);
    }

    // Fetch all conversations with their participants (user IDs)
    async findConversationsWithParticipants(): Promise<Room[]> {
        const conversationKeys = await this.redis.client.keys('conversation:*');
        const rooms = [];

        for (const key of conversationKeys) {
            const conversation = key.split(':')[1];
            const participants = await this.redis.client.sMembers(key);
            rooms.push({ conversation, participants });
        }

        return rooms;
    }

    // Find participants by conversation
    async findParticipantsByConversationId(
        conversationId: string,
    ): Promise<Room | null> {
        const participants = await this.redis.client.sMembers(
            `conversation:${conversationId}`,
        );

        return participants.length ? { conversationId, participants } : null;
    }
}
