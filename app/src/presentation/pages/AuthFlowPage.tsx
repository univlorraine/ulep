import { IonPage, useIonToast } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { TailSpin } from 'react-loader-spinner';
import CenterLayout from '../components/layout/CenterLayout';
import { useTranslation } from 'react-i18next';
import Profile from '../../domain/entities/Profile';
import User from '../../domain/entities/User';
import { useStoreActions } from '../../store/storeTypes';

const AuthPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const { configuration, getProfile, getUser, getTokenFromCodeUsecase } = useConfig();
    const setProfile = useStoreActions((store) => store.setProfile);
    const setUser = useStoreActions((store) => store.setUser);
    const history = useHistory();
    const [showToast] = useIonToast();

    const getAccessToken = async (code: string) => {
        const result = await getTokenFromCodeUsecase.execute({ code, redirectUri: `${window.location.origin}/auth` });

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
