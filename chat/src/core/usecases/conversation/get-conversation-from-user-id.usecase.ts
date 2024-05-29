import { Inject, Injectable } from '@nestjs/common';
import { MEDIA_OBJECT_REPOSITORY } from '../../ports/media-object.repository';
import { ConversationRepository } from 'src/core/ports/conversation.repository';

export class GetConversationFromUserIdCommand {
    id: string;
}

@Injectable()
export class GetConversationFromUserIdUsecase {
    constructor(
        @Inject(MEDIA_OBJECT_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: GetConversationFromUserIdCommand) {
        const conversation = await this.conversationRepository.findByUserId(
            command.id,
        );

        return conversation;
    }
}
