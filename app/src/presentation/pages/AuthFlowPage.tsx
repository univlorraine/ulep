import { IonPage, useIonToast } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { TailSpin } from 'react-loader-spinner';
import CenterLayout from '../components/layout/CenterLayout';
import { useTranslation } from 'react-i18next';

const AuthPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const { configuration, getTokenFromCodeUsecase } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();

    const getAccessToken = async (code: string) => {
        const result = await getTokenFromCodeUsecase.execute({ code, redirectUri: `${window.location.origin}/auth` });

        if (result instanceof Error) {
            showToast(t('global.error'), 5000);
            return history.goBack();
        }

        if ('accessToken' in result) {
            // TODO(future): call connector here to initialize store with values from university ?
            return history.push('/signup/informations');
        }
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
