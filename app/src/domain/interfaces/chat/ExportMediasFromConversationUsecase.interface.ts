interface ExportMediasFromConversationUsecaseInterface {
    execute(id: string): Promise<void | Error>;
}
export default ExportMediasFromConversationUsecaseInterface;
