import { Message } from 'src/core/models';

export const HUB_GATEWAY = 'hub.gateway';

export abstract class HubGateway {
    // Publish new message.
    abstract publish(update: Message): void;

    // Add user to topic.
    abstract subscribe(topic: string, user: string): void;

    // Remove user from topic.
    abstract unsubscribe(topic: string, user: string): void;
}
