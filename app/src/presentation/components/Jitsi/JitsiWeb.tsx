import { JitsiMeeting } from '@jitsi/react-sdk';
import IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import { useRef } from 'react';
import { useHistory } from 'react-router';
import { JitsiProps } from './VisioContainer';

const JitsiWeb = ({ jitsiDomain, language, roomName, jitsiToken }: JitsiProps) => {
    const history = useHistory();
    const apiRef = useRef<IJitsiMeetExternalApi>();

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
        <div style={{ width: '100%', height: '100%' }}>
            <JitsiMeeting
                domain={jitsiDomain}
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
                onReadyToClose={() => history.push('/home')}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                }}
            />
        </div>
    );
};

export default JitsiWeb;
