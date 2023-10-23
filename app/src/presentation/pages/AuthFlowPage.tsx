import { IonPage, useIonToast } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { TailSpin } from 'react-loader-spinner';
import CenterLayout from '../components/layout/CenterLayout';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';

const AuthPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const { configuration, getTokenFromCodeUsecase } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();

    const getAccessToken = async (code: string) => {
        console.warn(Capacitor.isNativePlatform() ? 'ulep://auth' : `${window.location.origin}/auth`);
        const result = await getTokenFromCodeUsecase.execute({
            code,
            redirectUri: Capacitor.isNativePlatform() ? 'ulep://auth' : `${window.location.origin}/auth`,
        });

        if (result instanceof Error) {
            await showToast(t('global.error'), 5000);
            return history.goBack();
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
                <TailSpin
                    height="150"
                    width="150"
                    color={configuration.primaryColor}
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </CenterLayout>
        </IonPage>
    );
};

export default AuthPage;
