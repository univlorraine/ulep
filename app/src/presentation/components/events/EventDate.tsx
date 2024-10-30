import { IonIcon } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import EventObject from '../../../domain/entities/Event';
import Profile from '../../../domain/entities/Profile';
import { useStoreState } from '../../../store/storeTypes';
import styles from './EventDate.module.css';
interface EventDateProps {
    showAddToCalendar?: boolean;
    event: EventObject;
    profile: Profile;
}

const EventDate: React.FC<EventDateProps> = ({ event, profile, showAddToCalendar = false }) => {
    const { t } = useTranslation();
    const language = useStoreState((state) => state.language);

    const handleAddToCalendar = (event: EventObject) => {
        const adress = event.address || event.deepLink;
        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.content}
DTSTART:${formatDateToICS(new Date(event.startDate))}
DTEND:${formatDateToICS(new Date(event.endDate))}
LOCATION:${adress}
END:VEVENT
END:VCALENDAR
    `;
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${event.title}.ics`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatDateToICS = (date: Date) => {
        const dateObject = new Date(date);
        return dateObject.toISOString().replace(/-/g, '').replace('T', '').replace(/:\d+$/, '');
    };

    const formattedDate = new Intl.DateTimeFormat(language || profile.nativeLanguage.code, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(event.startDate));
    return (
        <div className={styles['date-container']}>
            <IonIcon icon={calendarOutline} />
            <span className={styles.date}>{formattedDate}</span>
            {showAddToCalendar && (
                <button className={styles.calendarButton} onClick={() => handleAddToCalendar(event)}>
                    {t('events.add_to_calendar')}
                </button>
            )}
        </div>
    );
};

export default EventDate;
