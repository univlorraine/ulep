interface SubscribeToEventUsecase {
    execute(eventId: string, profileId: string): Promise<void | Error>;
}

export default SubscribeToEventUsecase;
