import { IonPage, useIonToast } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import CenterLayout from '../components/layout/CenterLayout';
import { useTranslation } from 'react-i18next';
import Profile from '../../domain/entities/Profile';
import User from '../../domain/entities/User';
import { useStoreActions } from '../../store/storeTypes';
import { Capacitor } from '@capacitor/core';
import Loader from '../components/Loader';

const AuthPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const { browserAdapter, capacitorAdapter, getProfile, getUser, getTokenFromCodeUsecase } = useConfig();
    const setProfile = useStoreActions((store) => store.setProfile);
    const setUser = useStoreActions((store) => store.setUser);
    const history = useHistory();
    const [showToast] = useIonToast();

    const getAccessToken = async (code: string) => {
        const result = await getTokenFromCodeUsecase.execute({
            code,
            redirectUri: capacitorAdapter.isNativePlatform() ? 'ulep://auth' : `${window.location.origin}/auth`,
        });

        // Close browser after the user is redirected to the app (mobile only)
        if (capacitorAdapter.isNativePlatform()) {
            await browserAdapter.close();
        }

        if (result instanceof Error) {
            await showToast(t('global.error'), 5000);
            return history.goBack();
        }

        const resultProfile = await getProfile.execute(result.accessToken);
        if (resultProfile instanceof Profile) {
            setProfile({ profile: resultProfile });
            return history.push('/home');
        }

        const resultUser = await getUser.execute(result.accessToken);
        if (resultUser instanceof User) {
            setUser({ user: resultUser });
            return history.push('/signup/languages');
        }

        return history.push('/signup', { fromIdp: true });
    };

    useEffect(() => {
        if (code) {
            getAccessToken(code);
        }
    }, [code]);

    return (
        <IonPage>
            <CenterLayout>
                <Loader height="150" width="150" wrapperStyle={{}} wrapperClass="" />
            </CenterLayout>
        </IonPage>
    );
};

export default AuthPage;
