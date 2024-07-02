import { useEffect, useState } from 'react';
import { isPlatform, IonLoading } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigurationContext';
import { useTranslation } from 'react-i18next';
import JitsiMobile from './JitsiMobile';
import JitsiWeb from './JitsiWeb';
import useLogout from '../../hooks/useLogout';

export interface JitsiProps {
    jitsiDomain: string;
    language: string;
    roomName: string;
    jitsiToken: string;
}

const VisioContainer = () => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const { accessToken, getJitsiToken } = useConfig();
    const { handleLogout } = useLogout({ forceRedirect: true });
    const [jitsiToken, setJitsiToken] = useState<string>();
    const jitsiDomain = import.meta.env.VITE_JITSI_DOMAIN;

    const roomName = location.search ? location.search.split('roomName=')[1] : '';

    const fetchJitsiToken = async () => {
        const response = await getJitsiToken.execute(accessToken);

        if (response instanceof Error) {
            return handleLogout();
        }

        return setJitsiToken(response.token);
    };

    useEffect(() => {
        fetchJitsiToken();
    }, []);

    if (roomName === '' || !jitsiToken) {
        return <IonLoading isOpen={true} />;
    }

    if (isPlatform('cordova')) {
        // native device, open jitsi capacitor plugin
        return (
            <JitsiMobile
                jitsiDomain={jitsiDomain}
                language={i18n.language}
                roomName={roomName}
                jitsiToken={jitsiToken}
            />
        );
    } else {
        return (
            <JitsiWeb jitsiDomain={jitsiDomain} language={i18n.language} roomName={roomName} jitsiToken={jitsiToken} />
        );
    }
};

export default VisioContainer;
