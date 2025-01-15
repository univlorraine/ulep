import { IonContent } from '@ionic/react';
import { Redirect, useHistory } from 'react-router';
import EventObject from '../../../domain/entities/Event';
import { useStoreState } from '../../../store/storeTypes';
import EventsListContent from '../../components/contents/events/EventsListContent';

const EventListPage = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/home');
    };

    const onShowEventPressed = (event?: EventObject) => {
        history.push('show-event', { event });
    };

    return (
        <IonContent>
            <EventsListContent profile={profile} onBackPressed={goBack} onEventPressed={onShowEventPressed} />
        </IonContent>
    );
};

export default EventListPage;
