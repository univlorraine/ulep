import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import EventObject from '../../../domain/entities/Event';
import Profile from '../../../domain/entities/Profile';
import EventLine from './EventLine';

interface EventsListProps {
    events: EventObject[];
    profile: Profile;
    onEventPressed: (event?: EventObject) => void;
}

const EventsList: React.FC<EventsListProps> = ({ events, profile, onEventPressed }) => {
    const { t } = useTranslation();
    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.events.title')}</span>
            {events.map((eventItem: EventObject) => (
                <EventLine
                    key={eventItem.id}
                    event={eventItem}
                    profile={profile}
                    onClick={() => onEventPressed(eventItem)}
                />
            ))}
            <IonButton fill="clear" className="primary-button" onClick={() => onEventPressed()}>
                {t('home_page.events.see_all')}
            </IonButton>
        </div>
    );
};

export default EventsList;
