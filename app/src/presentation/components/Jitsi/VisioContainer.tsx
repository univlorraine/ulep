import { IonLoading, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import { UserChat } from '../../../domain/entities/User';
import { useStoreState } from '../../../store/storeTypes';
import useGetHomeData from '../../hooks/useGetHomeData';
import JitsiMobile from './JitsiMobile';
import JitsiWeb from './JitsiWeb';

export interface JitsiProps {
    jitsiUrl: string;
    language: string;
    roomName: string;
    jitsiToken: string;
    tandem?: Tandem;
}

interface VisioContainerProps {
    tandemPartner?: Profile | UserChat;
    learningLanguageId: string;
}

const isProfile = (obj: any): obj is Profile => {
    return obj && obj.user && typeof obj.user.firstname === 'string' && typeof obj.user.lastname === 'string';
};

const VisioContainer = () => {
    const { i18n } = useTranslation();
    const location = useLocation<VisioContainerProps>();
    const { accessToken, getJitsiToken, updateVisioDuration } = useConfig();
    const history = useHistory();
    const [jitsiToken, setJitsiToken] = useState<string>();
    const jitsiUrl = useStoreState((state) => state.jitsiUrl);
    const roomName = location.search ? location.search.split('roomName=')[1] : '';
    const { tandemPartner, learningLanguageId } = location.state || {};
    const { tandems, isLoading } = useGetHomeData();
    const tandem = tandems.find((t) => t.id === roomName);

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

    useEffect(() => {
        if (!tandemPartner) {
            return;
        }

        const firstname = isProfile(tandemPartner) ? tandemPartner.user.firstname : tandemPartner.firstname;
        const lastname = isProfile(tandemPartner) ? tandemPartner.user.lastname : tandemPartner.lastname;

        const interval = setInterval(() => {
            updateVisioDuration.execute({
                learningLanguageId,
                roomName,
                partnerTandemId: tandemPartner.id,
                partnerFirstname: firstname,
                partnerLastname: lastname,
            });
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading || roomName === '' || !jitsiToken) {
        return <IonLoading isOpen={true} />;
    }

    if (isPlatform('cordova')) {
        // native device, open jitsi capacitor plugin
        return (
            <JitsiMobile
                jitsiUrl={jitsiUrl}
                language={i18n.language}
                roomName={roomName}
                jitsiToken={jitsiToken}
                tandem={tandem}
            />
        );
    } else {
        return (
            <JitsiWeb
                jitsiUrl={jitsiUrl}
                language={i18n.language}
                roomName={roomName}
                jitsiToken={jitsiToken}
                tandem={tandem}
            />
        );
    }
};

export default VisioContainer;
