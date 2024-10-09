import Session from "../entities/Session";

export type CancelSessionCommand = {
    id: string;
    comment?: string;
};

interface CancelSessionUsecaseInterface {
    execute(command: CancelSessionCommand): Promise<Session | Error>;
}
export default CancelSessionUsecaseInterface;