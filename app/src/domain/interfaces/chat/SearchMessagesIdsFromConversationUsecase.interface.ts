interface SearchMessagesIdsFromConversationUsecaseInterface {
    execute(id: string, searchText: string): Promise<string[] | Error>;
}

export default SearchMessagesIdsFromConversationUsecaseInterface;
