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

const JitsiMobile = ({ jitsiUrl, roomName, jitsiToken }: JitsiProps) => {
    const history = useHistory();
    const { deviceAdapter, sendMessage } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const [currentJitsiParticipantId, setCurrentJitsiParticipantId] = useState<string | null>(null);
    const currentJitsiParticipantIdRef = useRef<string | null>(null);

    const initialiseJitsi = async () => {
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
    };

    const onJitsiUnloaded = async () => {
        if (isPlatform('cordova')) {
            window.removeEventListener('onConferenceLeft', onJitsiUnloaded);
            window.removeEventListener('onChatMessageReceived', (data: any) => onChatMessageReceived(data));
            window.removeEventListener('onParticipantsInfoRetrieved', (data: any) => onParticipantsInfoRetrieved(data));
        }

        history.push('/end-session');
    };

    const onChatMessageReceived = async (data: OnChatMessageReceivedProps) => {
        const currentId = currentJitsiParticipantIdRef.current;
        if (roomName && data.senderId === currentId) {
            const result = await sendMessage.execute(roomName, profile!.user.id, data.message);

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
        //  /!\ WARING: Because of the Strict Mode, the listeners are added twice + on trigger, messages are sent twice
        window.addEventListener('onConferenceLeft', onJitsiUnloaded);
        window.addEventListener('onParticipantsInfoRetrieved', (data: any) => onParticipantsInfoRetrieved(data));
        window.addEventListener('onChatMessageReceived', (data: any) => onChatMessageReceived(data));
        initialiseJitsi();

        return () => {
            window.removeEventListener('onConferenceLeft', onJitsiUnloaded);
            window.removeEventListener('onChatMessageReceived', (data: any) => onChatMessageReceived(data));
            window.removeEventListener('onParticipantsInfoRetrieved', (data: any) => onParticipantsInfoRetrieved(data));
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
