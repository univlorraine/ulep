import { IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import EventObject, { EventType } from '../../../domain/entities/Event';
import styles from './EventAdress.module.css';

interface EventAdressProps {
    event: EventObject;
    showMap?: boolean;
}

const EventAdress: React.FC<EventAdressProps> = ({ event, showMap = false }) => {
    const { t } = useTranslation();
    const { browserAdapter } = useConfig();

    const handleOpenMaps = () => {
        if (event.deepLink) {
            browserAdapter.open(event.deepLink);
        }
    };

    return (
        <div className={styles['adress-container']}>
            <IonIcon icon={locationOutline} />
            {event.type === EventType.ONLINE ? (
                <span className={styles.adress}>{t('events.online')}</span>
            ) : (
                <span className={styles.adress}>{event.addressName}</span>
            )}
            {showMap && event.type !== EventType.ONLINE && (
                <button className={styles.mapButton} onClick={handleOpenMaps}>
                    {t('events.open_maps')}
                </button>
            )}
        </div>
    );
};

export default EventAdress;
