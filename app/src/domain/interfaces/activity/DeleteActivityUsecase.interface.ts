interface DeleteActivityUsecaseInterface {
    execute: (id: string) => Promise<void | Error>;
}

export default DeleteActivityUsecaseInterface;
