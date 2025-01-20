interface GetActivityPdfUsecaseInterface {
    execute: (id: string) => Promise<void | Error>;
}

export default GetActivityPdfUsecaseInterface;
