import Session from "../entities/Session";

export type CreateSessionCommand = {
    startAt: Date;
    comment: string;
    tandemId: string;
};

interface CreateSessionUsecaseInterface {
    execute(command: CreateSessionCommand): Promise<Session | Error>;
}
export default CreateSessionUsecaseInterface;   
