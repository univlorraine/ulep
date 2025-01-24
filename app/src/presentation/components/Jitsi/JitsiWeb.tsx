import { IonLoading } from '@ionic/react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import { useRef } from 'react';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreState } from '../../../store/storeTypes';
import useGetHomeData from '../../hooks/useGetHomeData';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import HomeHeader from '../HomeHeader';
import styles from './JitsiWeb.module.css';
import { JitsiProps } from './VisioContainer';
import VisioInfoFrame from './VisioInfoFrame';

const JitsiWeb = ({ jitsiUrl, language, roomName, jitsiToken }: JitsiProps) => {
    const history = useHistory();
    const apiRef = useRef<IJitsiMeetExternalApi>();
    const { width } = useWindowDimensions();
    const { sendMessage } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const { tandems, isLoading } = useGetHomeData();
    const tandem = tandems.find((t) => t.id === roomName);

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isLoading) {
        return <IonLoading isOpen={true} message="Loading..." />;
    }

    const handleApiReady = (apiObj: IJitsiMeetExternalApi) => {
        apiRef.current = apiObj;
        apiRef.current.on('outgoingMessage', handleOutgoingMessage);
    };

    const handleOutgoingMessage = (payload: {
        privateMessage: boolean; // whether this is a private or group message
        message: string; // the text of the message
    }) => {
        if (!roomName) {
            return;
        }

        const result = sendMessage.execute({
            conversationId: roomName,
            senderId: profile.user.id,
            content: payload.message,
        });

        if (result instanceof Error) {
            console.error(result);
        }
    };

    return (
        <div className={styles.container}>
            {!isHybrid && <HomeHeader />}
            <div className={styles.content}>
                <JitsiMeeting
                    domain={jitsiUrl}
                    lang={language}
                    roomName={roomName}
                    jwt={jitsiToken}
                    configOverwrite={{
                        // https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-configuration
                        subject: 'ETANDEM',
                        startWithAudioMuted: true,
                        disableModeratorIndicator: true,
                        startScreenSharing: true,
                        enableEmailInStats: false,
                        prejoinConfig: {
                            enabled: false,
                        },
                        welcomePage: {
                            enabled: false,
                        },
                        closePage: {
                            enabled: false,
                        },
                    }}
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                        DEFAULT_LOCAL_DISPLAY_NAME: language.toUpperCase(),
                        SHOW_CHROME_EXTENSION_BANNER: true,
                        TOOLBAR_ALWAYS_VISIBLE: true,
                        SETTINGS_SECTIONS: ['devices', 'language'],
                        TOOLBAR_BUTTONS: [
                            'microphone',
                            'camera',
                            'hangup',
                            'desktop',
                            'profile',
                            'chat',
                            'settings',
                            'raisehand',
                            'videoquality',
                        ],
                    }}
                    onApiReady={(externalApi) => {
                        // here you can attach custom event listeners to the Jitsi Meet External API
                        // you can also store it locally to execute commands
                        handleApiReady(externalApi);
                    }}
                    onReadyToClose={() => {
                        isHybrid
                            ? history.push('/end-session', { tandem })
                            : history.push('/home', { tandem, endSession: true });
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = isHybrid ? '100%' : 'calc(100vh - 80px)';
                        iframeRef.style.flex = '1';
                    }}
                />
                {!isHybrid && <VisioInfoFrame tandem={tandem} />}
            </div>
        </div>
    );
};

export default JitsiWeb;
