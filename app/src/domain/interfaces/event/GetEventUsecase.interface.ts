import EventObject from '../../entities/Event';

interface GetEventUsecaseInterface {
    execute: (eventId: string) => Promise<EventObject | Error>;
}

export default GetEventUsecaseInterface;
