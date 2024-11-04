import { IonButton, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import EventObject, { EventType } from '../../../domain/entities/Event';
import Profile from '../../../domain/entities/Profile';
import styles from './EventSubscribeButton.module.css';

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
        const hasUserSubscribed = !event.withSubscription || event.isUserSubscribed;

        if (hasUserSubscribed && event.type === EventType.PRESENTIAL) {
            return t('events.join');
        } else if (hasUserSubscribed && event.type === EventType.ONLINE) {
            return t('events.join_online');
        } else if (event.withSubscription && event.isUserSubscribed) {
            return t('events.unsubscribe');
        }
        return t('events.subscribe');
    };

    const handleButtonClick = async () => {
        if (event.withSubscription && !event.isUserSubscribed) {
            await onSubscribeToEvent();
        } else if (event.type === EventType.PRESENTIAL && event.address && event.deepLink) {
            browserAdapter.open(event.deepLink);
        } else if (event.type === EventType.ONLINE && event.eventURL) {
            browserAdapter.open(event.eventURL);
        }
    };

    const handleButtonStyle = () => {
        if (event.withSubscription && event.isUserSubscribed && !event.isUserSubscribed) {
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
        <div className={styles['button-container']}>
            <IonButton fill="clear" className={`${handleButtonStyle()} no-padding`} onClick={handleButtonClick}>
                {handleButtonName()}
            </IonButton>
            {event.withSubscription && event.isUserSubscribed && (
                <IonButton fill="clear" className={`tertiary-button no-padding`} onClick={onUnsubscribeToEvent}>
                    {t('events.unsubscribe')}
                </IonButton>
            )}
        </div>
    );
};

export default EventSubscribeButton;
