import { IonLoading, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreState } from '../../../store/storeTypes';
import JitsiMobile from './JitsiMobile';
import JitsiWeb from './JitsiWeb';

export interface JitsiProps {
    jitsiUrl: string;
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
    const jitsiUrl = useStoreState((state) => state.jitsiUrl);

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
        return <JitsiMobile jitsiUrl={jitsiUrl} language={i18n.language} roomName={roomName} jitsiToken={jitsiToken} />;
    } else {
        return <JitsiWeb jitsiUrl={jitsiUrl} language={i18n.language} roomName={roomName} jitsiToken={jitsiToken} />;
    }
};

export default VisioContainer;
