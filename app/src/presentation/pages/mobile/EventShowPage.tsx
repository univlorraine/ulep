import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import EventObject from '../../../domain/entities/Event';
import { useStoreState } from '../../../store/storeTypes';
import EventsContent from '../../components/contents/events/EventsContent';

interface EventShowPageProps {
    event: EventObject;
}

const EventShowPage = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const location = useLocation<EventShowPageProps>();
    const { event } = location.state;

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/events');
    };

    return (
        <IonContent>
            <EventsContent eventId={event.id} profile={profile} onBackPressed={goBack} />
        </IonContent>
    );
};

export default EventShowPage;
