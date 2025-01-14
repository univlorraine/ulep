import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    HASHTAG_REPOSITORY,
    HashtagRepository,
} from 'src/core/ports/hastag.repository';

export class GetHashtagsFromConversationIdCommand {
    id: string;
}

@Injectable()
export class GetHashtagsFromConversationIdUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(HASHTAG_REPOSITORY)
        private readonly hashtagRepository: HashtagRepository,
    ) {}

    async execute(command: GetHashtagsFromConversationIdCommand) {
        const conversation = await this.conversationRepository.findById(
            command.id,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        const hashtags = await this.hashtagRepository.findAllByConversationId(
            conversation.id,
        );

        return hashtags;
    }
}
