interface UnsubscribeToEventUsecase {
    execute(eventId: string, profileId: string): Promise<void | Error>;
}

export default UnsubscribeToEventUsecase;
