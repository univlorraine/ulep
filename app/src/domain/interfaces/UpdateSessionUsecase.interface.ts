import Session from "../entities/Session";

export type UpdateSessionCommand = {
    id: string;
    startAt: Date;
    comment: string;
};

interface UpdateSessionUsecaseInterface {
    execute(command: UpdateSessionCommand): Promise<Session | Error>;
}
export default UpdateSessionUsecaseInterface;   
