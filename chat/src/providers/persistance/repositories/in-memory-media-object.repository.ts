import { Collection } from '@app/common';
import { Injectable } from '@nestjs/common';
import { MediaObject } from 'src/core/models/media.model';
import { MediaObjectRepository } from 'src/core/ports/media-object.repository';

@Injectable()
export class InMemoryMediaObjectRepository implements MediaObjectRepository {
    #mediaObjects: MediaObject[] = [];
    #messageMediaMap: Map<string, MediaObject[]> = new Map();

    get mediaObjects(): MediaObject[] {
        return this.#mediaObjects;
    }

    init(mediaObjects: MediaObject[]): void {
        this.#mediaObjects = mediaObjects;
    }

    reset(): void {
        this.#mediaObjects = [];
        this.#messageMediaMap.clear();
    }

    async all(): Promise<Collection<MediaObject>> {
        return {
            items: this.#mediaObjects,
            totalItems: this.#mediaObjects.length,
        };
    }

    async findOne(id: string): Promise<MediaObject | null> {
        const mediaObject = this.#mediaObjects.find((media) => media.id === id);
        return mediaObject || null;
    }

    async saveFile(object: MediaObject, messageId: string): Promise<void> {
        this.#mediaObjects.push(object);
        const existingMedia = this.#messageMediaMap.get(messageId) || [];
        existingMedia.push(object);
        this.#messageMediaMap.set(messageId, existingMedia);
        return Promise.resolve();
    }

    async saveThumbnail(object: MediaObject, messageId: string): Promise<void> {
        this.#mediaObjects.push(object);
        return Promise.resolve();
    }

    async remove(id: string): Promise<void> {
        const index = this.#mediaObjects.findIndex((media) => media.id === id);
        if (index !== -1) {
            // Remove from the main array
            const [removedObject] = this.#mediaObjects.splice(index, 1);
            // Remove from the map
            this.#messageMediaMap.forEach((mediaList, messageId) => {
                const mediaIndex = mediaList.findIndex(
                    (media) => media.id === removedObject.id,
                );
                if (mediaIndex !== -1) {
                    mediaList.splice(mediaIndex, 1);
                    if (mediaList.length === 0) {
                        this.#messageMediaMap.delete(messageId);
                    } else {
                        this.#messageMediaMap.set(messageId, mediaList);
                    }
                }
            });
        }
        return Promise.resolve();
    }

    findAllByConversationId(conversationId: string): Promise<MediaObject[]> {
        return Promise.resolve(this.#mediaObjects);
    }
}
