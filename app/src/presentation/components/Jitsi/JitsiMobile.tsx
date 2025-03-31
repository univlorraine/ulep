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

import { IonButton, IonGrid, IonLabel, IonList, IonRow, isPlatform } from '@ionic/react';
import { Jitsi } from 'capacitor-jitsi-meet';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreState } from '../../../store/storeTypes';
import { JitsiProps } from './VisioContainer';

interface OnChatMessageReceivedProps {
    isTrusted: boolean;
    isLocal: boolean;
    senderId: string;
    isPrivate: string;
    message: string;
    timestamp: string;
}

interface ParticipantInfo {
    participantsInfo: string;
}

const JitsiMobile = ({ jitsiUrl, roomName, jitsiToken, tandem }: JitsiProps) => {
    const history = useHistory();
    const { deviceAdapter, sendMessage } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const isJitsiInitializedRef = useRef(false);
    const [currentJitsiParticipantId, setCurrentJitsiParticipantId] = useState<string | null>(null);
    const currentJitsiParticipantIdRef = useRef<string | null>(null);

    const initialiseJitsi = async () => {
        if (isJitsiInitializedRef.current) return;
        isJitsiInitializedRef.current = true;

        await Jitsi.joinConference({
            roomName: roomName,
            url: `https://${jitsiUrl}/`,
            token: jitsiToken,
            channelLastN: '10',
            avatarURL: '',
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            chatEnabled: true,
            inviteEnabled: false,
            callIntegrationEnabled: false,
            featureFlags: {
                // https://github.com/jitsi/jitsi-meet/blob/master/react/features/base/flags/constants.ts
                'welcomepage.enabled': false,
                // 'pip.enabled': true,
                // 'pip-while-screen-sharing.enabled': true,
                'prejoinpage.enabled': false, // go straight to the meeting and do not show the pre-join page
                'recording.enabled': false, // disable as it requires Dropbox integration
                'live-streaming.enabled': false, // 'sign in on Google' button not yet functional
                'android.screensharing.enabled': false, // experimental feature, not fully production ready
                'meeting-name.enabled': false, // displaying the meeting name.
            },
            configOverrides: {
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                prejoinConfigPage: false,
            },
        });
        window.addEventListener('onConferenceLeft', onJitsiUnloaded);
    };

    const onJitsiUnloaded = async () => {
        if (isPlatform('cordova')) {
            window.removeEventListener('onConferenceLeft', onJitsiUnloaded);
            window.removeEventListener('onChatMessageReceived', (data: any) => onChatMessageReceived(data));
            window.removeEventListener('onParticipantsInfoRetrieved', (data: any) => onParticipantsInfoRetrieved(data));
        }

        history.push('/end-session', { tandem });
    };

    const onChatMessageReceived = async (data: OnChatMessageReceivedProps) => {
        const currentId = currentJitsiParticipantIdRef.current;
        if (roomName && data.senderId === currentId) {
            const result = await sendMessage.execute({
                conversationId: roomName,
                senderId: profile!.user.id,
                content: data.message,
            });

            if (result instanceof Error) {
                console.error(result);
            }
        }
    };

    const onParticipantsInfoRetrieved = async (data: ParticipantInfo) => {
        let participantId;
        if (deviceAdapter.isAndroid()) {
            participantId = handlePayloadForAndroid(data);
        } else {
            participantId = handlePayloadForIos(data);
        }
        setCurrentJitsiParticipantId(participantId);
    };

    useEffect(() => {
        currentJitsiParticipantIdRef.current = currentJitsiParticipantId;
    }, [currentJitsiParticipantId]);

    const handlePayloadForAndroid = (payload: any) => {
        const participantsInfoString = payload.participantsInfo;
        const jsonString = participantsInfoString
            .replace(/(\w+)=/g, '"$1":') // Remplace les égalités par des deux-points
            .replace(/:([^,\]}]+)/g, (match: string, p1: any) => {
                // Ajoute des guillemets autour des valeurs de chaîne, sauf pour les booléens
                if (p1 === 'true' || p1 === 'false' || !isNaN(p1)) {
                    return `:${p1}`;
                }
                return `:"${p1.replace(/"/g, '\\"')}"`; // Échappe les guillemets dans les valeurs
            });
        const participantsInfo = JSON.parse(jsonString);

        return participantsInfo.find((participant: any) => participant.isLocal === true).participantId;
    };

    const handlePayloadForIos = (payload: any) => {
        const participantsArray = Object.keys(payload)
            .filter((key) => !isNaN(Number(key)))
            .map((key) => payload[key]);

        return participantsArray.find((participant: any) => participant.isLocal === true).participantId;
    };

    useEffect(() => {
        const handleConferenceLeft = () => onJitsiUnloaded();
        const handleParticipantsInfoRetrieved = (data: any) => onParticipantsInfoRetrieved(data);
        const handleChatMessageReceived = (data: any) => onChatMessageReceived(data);
        //  /!\ WARING: Because of the Strict Mode, the listeners are added twice + on trigger, messages are sent twice
        window.addEventListener('onConferenceLeft', handleConferenceLeft);
        window.addEventListener('onParticipantsInfoRetrieved', handleParticipantsInfoRetrieved);
        window.addEventListener('onChatMessageReceived', handleChatMessageReceived);
        initialiseJitsi();

        return () => {
            window.removeEventListener('onConferenceLeft', handleConferenceLeft);
            window.removeEventListener('onChatMessageReceived', handleChatMessageReceived);
            window.removeEventListener('onParticipantsInfoRetrieved', handleParticipantsInfoRetrieved);
        };
    }, []);

    return (
        // TODO: Design and translate this page for mobile use only
        <div className="full-height">
            <IonGrid className="full-height">
                <IonRow className="full-height ion-justify-content-center ion-align-items-center">
                    <IonList class="ion-padding">
                        <IonRow class="ion-justify-content-center ion-margin">
                            <IonLabel>Your Have Left the Video Session</IonLabel>
                        </IonRow>
                        <IonRow class="ion-justify-content-center">
                            <IonButton fill="clear" onClick={initialiseJitsi}>
                                Rejoin Video Session
                            </IonButton>
                        </IonRow>
                        <IonRow class="ion-justify-content-center">
                            <IonButton fill="clear" routerLink="/home">
                                Go to Home
                            </IonButton>
                        </IonRow>
                    </IonList>
                </IonRow>
            </IonGrid>
        </div>
    );
};

export default JitsiMobile;
