import { IonLoading, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigurationContext';
import JitsiMobile from './JitsiMobile';
import JitsiWeb from './JitsiWeb';

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
    const history = useHistory();
    const [jitsiToken, setJitsiToken] = useState<string>();
    const jitsiDomain = import.meta.env.VITE_JITSI_DOMAIN;

    const roomName = location.search ? location.search.split('roomName=')[1] : '';

    const fetchJitsiToken = async () => {
        const response = await getJitsiToken.execute(accessToken);

        if (response instanceof Error) {
            return history.push('/home');
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
