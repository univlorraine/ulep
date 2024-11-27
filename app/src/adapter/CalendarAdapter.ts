import EventObject from '../domain/entities/Event';
import CalendarAdapterInterface from './interfaces/CalendarAdapter.interface';

class CalendarAdapter implements CalendarAdapterInterface {
    addEventToCalendar(event: EventObject): void {
        console.log('add event to calendar', event);
    }
}

export default CalendarAdapter;
