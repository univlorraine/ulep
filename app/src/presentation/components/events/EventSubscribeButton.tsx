/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
