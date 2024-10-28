import { IonIcon, IonImg } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import EventObject, { EventType } from '../../../domain/entities/Event';
import Profile from '../../../domain/entities/Profile';
import LanguageTag from '../LanguageTag';
import UniversityTag from '../UniversityTag';
import styles from './EventLine.module.css';

interface EventLineProps {
    event: EventObject;
    profile: Profile;
    onClick: () => void;
}

interface EventAdressProps {
    event: EventObject;
}

const EventAdress: React.FC<EventAdressProps> = ({ event }) => {
    const { t } = useTranslation();
    return (
        <div className={styles['adress-container']}>
            <IonIcon icon={locationOutline} />
            {event.type === EventType.ONLINE ? (
                <span className={styles.adress}>{t('events.online')}</span>
            ) : (
                <span className={styles.adress}>{event.addressName}</span>
            )}
        </div>
    );
};

const EventLine: React.FC<EventLineProps> = ({ event, profile, onClick }) => {
    const { t } = useTranslation();
    const formattedDate = new Intl.DateTimeFormat(profile.nativeLanguage.code, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(event.startDate));

    return (
        <button
            aria-label={t('events.open', { title: event.title }) as string}
            className={styles.container}
            onClick={onClick}
        >
            {event.imageUrl && <IonImg className={styles.image} src={event.imageUrl} />}
            <div className={styles.content}>
                <div className={styles.tags}>
                    {event.diffusionLanguages.map((language) => (
                        <LanguageTag key={language.code} languageCode={language.code} />
                    ))}
                    <UniversityTag university={event.authorUniversity} />
                </div>
                <span className={styles.date}>{formattedDate}</span>
                <br />
                <span className={styles.title}>{event.title}</span>
                <br />
                <EventAdress event={event} />
            </div>
        </button>
    );
};

export default EventLine;
