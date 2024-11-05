import { IonButton, IonGrid, IonLabel, IonList, IonRow, isPlatform } from '@ionic/react';
import { Jitsi } from 'capacitor-jitsi-meet';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigurationContext';
import { JitsiProps } from './VisioContainer';

interface OnChatMessageReceivedProps {
    isTrusted: boolean;
    senderId: string;
    isPrivate: boolean;
    message: string;
    timestamp: string;
}

const JitsiMobile = ({ jitsiUrl, roomName, jitsiToken }: JitsiProps) => {
    const history = useHistory();
    const { sendMessage } = useConfig();
    const [count, setCount] = useState(0);

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

        console.warn('initialiseJitsi');
        // native device, open jitsi capacitor plugin
        window.addEventListener('onConferenceLeft', onJitsiUnloaded);
        window.addEventListener('outgoingMessage', (data: any) => {
            console.error('outgoingMessage', JSON.stringify(data));
            setCount(count + 1);
        });

        window.addEventListener('onChatMessageReceived', (data: any) => onChatMessageReceived(data));
        window.addEventListener('onParticipantsInfoRetrieved', (data: any) => {
            console.error('participant info', JSON.stringify(data));
            //{"isTrusted":false,"participantsInfo":"[{participantId=00b50123, name=My Name, role=moderator, avatarUrl=https://xxx.png, isLocal=true}
        });
    };

    const onJitsiUnloaded = async () => {
        console.warn('onJitsiUnloaded');
        console.warn('count', count);
        setCount(count + 1);
        if (isPlatform('cordova')) {
            window.removeEventListener('onConferenceLeft', onJitsiUnloaded);
            window.removeEventListener('onChatMessageReceived', () => onChatMessageReceived);
        }

        history.push('/end-session');
    };

    const onChatMessageReceived = async (data: OnChatMessageReceivedProps) => {
        console.log('roomName', roomName);
        console.log('onChatMessageReceived', data);
        if (roomName && data.isPrivate) {
            const result = await sendMessage.execute(roomName, data.senderId, data.message);

            if (result instanceof Error) {
                console.error(result);
            }
        }
    };

    useEffect(() => {
        initialiseJitsi();
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
                                Rejoin Video Session {count}
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
