import EventObject from '../../domain/entities/Event';

interface CalendarAdapterInterface {
    addEventToCalendar(event: EventObject): void;
}

export default CalendarAdapterInterface;
