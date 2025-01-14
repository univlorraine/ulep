import Hashtag from '../domain/entities/chat/Hashtag';

interface HashtagCommand {
    name: string;
    numberOfUses: number;
}

export const hashtagCommandToDomain = (command: HashtagCommand) => {
    return new Hashtag(command.name, command.numberOfUses);
};

export default HashtagCommand;
