interface ExportMediasFromConversationUsecaseInterface {
    execute(id: string): Promise<Blob | Error>;
}
export default ExportMediasFromConversationUsecaseInterface;
