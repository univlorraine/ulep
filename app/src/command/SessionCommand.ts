import Session from '../domain/entities/Session';

interface SessionCommand {
    id: string;
    tandemId: string;
    startAt: Date;
    comment: string;
    cancelledAt: Date;
}

export const sessionCommandToDomain = (command: SessionCommand) => {
    return new Session(
        command.id, 
        command.tandemId,
        new Date(command.startAt),
        command.comment,
        command.cancelledAt ? new Date(command.cancelledAt) : null
    );
};

export default SessionCommand;
