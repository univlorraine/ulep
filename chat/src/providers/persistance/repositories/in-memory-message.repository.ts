import { Collection } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/core/models/message.model';
import {
    MessagePagination,
    MessageRepository,
} from 'src/core/ports/message.repository';

@Injectable()
export class InMemoryMessageRepository implements MessageRepository {
    #messages: Message[] = [];

    get messages(): Message[] {
        return this.#messages;
    }

    init(messages: Message[]): void {
        this.#messages = messages;
    }

    reset(): void {
        this.#messages = [];
    }

    async all(): Promise<Collection<Message>> {
        return {
            items: this.#messages,
            totalItems: this.#messages.length,
        };
    }

    async findById(id: string): Promise<Message | null> {
        const message = this.#messages.find((message) => message.id === id);
        return message || null;
    }

    async like(id: string): Promise<Message> {
        const message = this.#messages.find((message) => message.id === id);
        if (!message) {
            return Promise.reject(null);
        }
        const updatedMessage = { ...message, likes: message.likes + 1 };
        return Promise.resolve(updatedMessage);
    }

    async unlike(id: string): Promise<Message> {
        const message = this.#messages.find((message) => message.id === id);
        if (!message) {
            return Promise.reject(null);
        }
        const updatedMessage = { ...message, likes: message.likes - 1 };
        return Promise.resolve(updatedMessage);
    }

    async create(message: Message): Promise<Message> {
        this.#messages.push(message);
        return Promise.resolve(message);
    }

    async update(updatedMessage: Message): Promise<Message> {
        const index = this.#messages.findIndex(
            (msg) => msg.id === updatedMessage.id,
        );

        if (index === -1) {
            return Promise.reject(null);
        }

        this.#messages[index] = updatedMessage;

        return Promise.resolve(updatedMessage);
    }

    async delete(id: string): Promise<void> {
        const index = this.#messages.findIndex((message) => message.id === id);

        if (index !== -1) {
            this.#messages.splice(index, 1);
        }

        return Promise.resolve();
    }

    async findMessagesByConversationId(
        conversationId: string,
        pagination?: MessagePagination,
        filter?: string,
    ): Promise<Message[]> {
        return this.#messages.filter(
            (message) => message.conversationId === conversationId,
        );
    }

    async searchMessagesIdByConversationId(
        conversationId: string,
        search: string,
    ): Promise<string[]> {
        return this.#messages
            .filter((message) => message.conversationId === conversationId)
            .filter((message) => message.content.includes(search))
            .map((message) => message.id);
    }
}
