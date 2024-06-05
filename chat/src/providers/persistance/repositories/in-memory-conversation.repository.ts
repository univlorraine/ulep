import { Injectable } from '@nestjs/common';
import { Collection } from '@app/common';
import { ConversationRepository } from 'src/core/ports/conversation.repository';
import { Conversation } from 'src/core/models/conversation.model';

@Injectable()
export class InMemoryConversationRepository implements ConversationRepository {
    #conversations: Conversation[] = [];

    get conversations(): Conversation[] {
        return this.#conversations;
    }

    init(conversations: Conversation[]): void {
        this.#conversations = conversations;
    }

    reset(): void {
        this.#conversations = [];
    }

    async all(): Promise<Collection<Conversation>> {
        return {
            items: this.#conversations,
            totalItems: this.#conversations.length,
        };
    }

    async findById(id: string): Promise<Conversation> {
        return this.#conversations.find(
            (conversation) => conversation.id === id,
        );
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        return this.#conversations.filter((conversation) =>
            conversation.usersIds.includes(userId),
        );
    }

    create(
        id: string,
        usersIds: string[],
        metadata: any,
    ): Promise<Conversation> {
        const conversation = new Conversation({
            id,
            usersIds,
            metadata,
            createdAt: new Date(),
            lastActivity: new Date(),
        });
        this.#conversations.push(conversation);
        return Promise.resolve(conversation);
    }

    async update(
        conversationId: string,
        usersIds: string[],
        metadata: any,
    ): Promise<Conversation> {
        const index = this.#conversations.findIndex(
            (conv) => conv.id === conversationId,
        );

        const updatedConversation = new Conversation({
            id: conversationId,
            usersIds,
            metadata,
            createdAt: new Date(),
            lastActivity: new Date(),
        });

        if (index === -1) {
            return Promise.reject(null);
        }

        this.#conversations[index] = updatedConversation;

        return Promise.resolve(updatedConversation);
    }

    delete(id: string): Promise<void> {
        const index = this.#conversations.findIndex(
            (conversation) => conversation.id === id,
        );

        if (index !== -1) {
            this.#conversations.splice(index, 1);
        }

        return Promise.resolve();
    }
}
