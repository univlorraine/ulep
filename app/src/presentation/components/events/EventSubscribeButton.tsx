import { IonButton, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import EventObject, { EventType } from '../../../domain/entities/Event';
import Profile from '../../../domain/entities/Profile';

interface EventSubscribeButtonProps {
    event: EventObject;
    profile: Profile;
    onEventSubscribed: () => void;
}

export const EventSubscribeButton: React.FC<EventSubscribeButtonProps> = ({ event, profile, onEventSubscribed }) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { subscribeToEvent, unsubscribeToEvent, browserAdapter } = useConfig();

    const handleButtonName = () => {
        if (!event.withSubscription && event.type === EventType.PRESENTIAL) {
            return t('events.join');
        } else if (!event.withSubscription && event.type === EventType.ONLINE) {
            return t('events.join_online');
        } else if (event.withSubscription && event.isUserSubscribed) {
            return t('events.unsubscribe');
        }
        return t('events.subscribe');
    };

    const handleButtonClick = async () => {
        if (event.withSubscription && event.isUserSubscribed) {
            await onUnsubscribeToEvent();
        } else if (event.withSubscription && !event.isUserSubscribed) {
            await onSubscribeToEvent();
            onEventSubscribed();
        } else if (!event.withSubscription && event.type === EventType.PRESENTIAL && event.address) {
            browserAdapter.open(event.address);
        } else if (!event.withSubscription && event.type === EventType.ONLINE && event.eventURL) {
            browserAdapter.open(event.eventURL);
        }
    };

    const handleButtonStyle = () => {
        if (event.withSubscription && event.isUserSubscribed) {
            return 'tertiary-button';
        }
        return 'primary-button';
    };

    const onSubscribeToEvent = async () => {
        const response = await subscribeToEvent.execute(event.id, profile.id);

        if (response instanceof Error) {
            showToast(t(response.message));
        }

        onEventSubscribed();
    };

    const onUnsubscribeToEvent = async () => {
        const response = await unsubscribeToEvent.execute(event.id, profile.id);

        if (response instanceof Error) {
            showToast(t(response.message));
        }

        onEventSubscribed();
    };

    return (
        <IonButton fill="clear" className={`${handleButtonStyle()} no-padding`} onClick={handleButtonClick}>
            {handleButtonName()}
        </IonButton>
    );
};

export default EventSubscribeButton;
