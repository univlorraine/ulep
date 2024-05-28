import { Inject, Injectable } from '@nestjs/common';
import { MEDIA_OBJECT_REPOSITORY } from '../../ports/media-object.repository';
import { ConversationRepository } from 'src/core/ports/conversation.repository';

export class DeleteConversationCommand {
    id: string;
}

@Injectable()
export class DeleteConversationUsecase {
    constructor(
        @Inject(MEDIA_OBJECT_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: DeleteConversationCommand) {
        await this.conversationRepository.delete(command.id);
    }
}
