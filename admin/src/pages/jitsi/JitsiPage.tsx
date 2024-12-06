import { JitsiMeeting } from '@jitsi/react-sdk';
import { useEffect, useState } from 'react';
import { Loading, useDataProvider, useLocaleState, useRedirect } from 'react-admin';
import { useLocation } from 'react-router-dom';

const JitsiPage = () => {
    const location = useLocation();
    const redirect = useRedirect();
    const [jitsiToken, setJitsiToken] = useState<string>();
    const jitsiDomain = window.REACT_APP_JITSI_DOMAIN;
    const dataProvider = useDataProvider();
    const [locale] = useLocaleState();

    const roomName = location.search ? location.search.split('roomName=')[1] : '';

    const fetchJitsiToken = async () => {
        const response = await dataProvider.getJitsiToken();

        if (response instanceof Error) {
            redirect('/conversations');
        }

        return setJitsiToken(response.token);
    };

    useEffect(() => {
        fetchJitsiToken();
    }, []);

    if (roomName === '' || !jitsiToken) {
        return <Loading />;
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <JitsiMeeting
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
                domain={jitsiDomain}
                getIFrameRef={(iframeRef) => {
                    // eslint-disable-next-line no-param-reassign
                    iframeRef.style.height = '100%';
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    DEFAULT_LOCAL_DISPLAY_NAME: locale.toUpperCase(),
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
                jwt={jitsiToken}
                lang={locale}
                onReadyToClose={() => redirect('/chat')}
                roomName={roomName}
            />
        </div>
    );
};

export default JitsiPage;
