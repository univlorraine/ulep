import { IonIcon } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import EventObject from '../../../domain/entities/Event';
import Profile from '../../../domain/entities/Profile';
import { useStoreState } from '../../../store/storeTypes';
import styles from './EventDate.module.css';
interface EventDateProps {
    event: EventObject;
    profile: Profile;
}

const EventDate: React.FC<EventDateProps> = ({ event, profile }) => {
    const language = useStoreState((state) => state.language);
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
        </div>
    );
};

export default EventDate;
