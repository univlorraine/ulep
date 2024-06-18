import { UserChat } from '../domain/entities/User';
import MediaObjectCommand, { mediaObjectCommandToDomain } from './MediaObjectCommand';

interface UserChatCommand {
    id: string;
    avatar?: MediaObjectCommand;
    email: string;
    firstname: string;
    lastname: string;
    isAdministrator: boolean;
}

export const userChatCommandToDomain = (command: UserChatCommand) => {
    return new UserChat(
        command.id,
        command.email,
        command.firstname,
        command.lastname,
        command.isAdministrator,
        command.avatar ? mediaObjectCommandToDomain(command.avatar) : undefined
    );
};

export default UserChatCommand;
