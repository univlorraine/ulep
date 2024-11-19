import { JitsiMeeting } from '@jitsi/react-sdk';
import IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import { useRef } from 'react';
import { useHistory } from 'react-router';
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
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const { tandems } = useGetHomeData();
    const tandem = tandems.find((t) => t.id === roomName);

    const handleApiReady = (apiObj: IJitsiMeetExternalApi) => {
        apiRef.current = apiObj;
        apiRef.current.on('outgoingMessage', handleOutgoingMessage);
    };

    const handleOutgoingMessage = (payload: {
        privateMessage: boolean; // whether this is a private or group message
        message: string; // the text of the message
    }) => {
        // TODO: Message sent from jitsi chat to sync with our chat
        console.log('handleOutgoingMessage', { payload });
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
                    onReadyToClose={() =>
                        isHybrid ? history.push('end-session') : history.push('/home', { endSession: true })
                    }
                    getIFrameRef={(iframeRef) => {
                        const calculatedHeight = window.innerHeight - 80;
                        iframeRef.style.height = `${calculatedHeight}px`;
                        iframeRef.style.flex = '1';
                    }}
                />
                {!isHybrid && <VisioInfoFrame tandem={tandem} />}
            </div>
        </div>
    );
};

export default JitsiWeb;
