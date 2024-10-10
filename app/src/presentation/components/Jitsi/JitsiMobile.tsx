import { IonButton, IonGrid, IonLabel, IonList, IonRow, isPlatform } from '@ionic/react';
import { Jitsi } from 'capacitor-jitsi-meet';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { JitsiProps } from './VisioContainer';

const JitsiMobile = ({ jitsiUrl, roomName, jitsiToken }: JitsiProps) => {
    const history = useHistory();

    const initialiseJitsi = async () => {
        // native device, open jitsi capacitor plugin
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
        }

        history.push('/end-session');
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
