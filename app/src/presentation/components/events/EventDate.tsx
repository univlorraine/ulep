import { IonIcon, useIonToast } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
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
    const [showToast] = useIonToast();
    const { fileAdapter } = useConfig();
    const language = useStoreState((state) => state.language);

    const handleAddToCalendar = async (event: EventObject) => {
        const address = event.address || event.deepLink || ''; // Utilise une chaîne vide si l'adresse est nulle
        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${event.id}
SUMMARY:${event.title}
DTSTAMP:${formatDateToICS(new Date())}
DTSTART:${formatDateToICS(new Date(event.startDate))}
DTEND:${formatDateToICS(new Date(event.endDate))}
LOCATION:${address}
END:VEVENT
END:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        await fileAdapter.saveBlob(blob, `${event.title.replace(/ /g, '_')}.ics`);
        await showToast({
            message: t('events.add_to_calendar_success'),
            duration: 3000,
        });
    };

    const formatDateToICS = (date: Date) => {
        const dateObject = new Date(date);
        return dateObject
            .toISOString()
            .replace(/[-:]/g, '')
            .replace(/\.\d+Z$/, 'Z');
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
