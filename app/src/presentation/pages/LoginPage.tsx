import { IonContent, IonPage, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Profile from '../../domain/entities/Profile';
import Tokens from '../../domain/entities/Tokens';
import User from '../../domain/entities/User';
import { useStoreActions } from '../../store/storeTypes';
import WelcomeContent from '../components/contents/WelcomeContent';
import LoginForm from '../components/forms/LoginForm';
import WebLayout from '../components/layout/WebLayout';
import useRedirectToHomeIfLogged from '../hooks/useRedirectToHomeIfLogged';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const LoginPage: React.FC = () => {
    const { width } = useWindowDimensions();
    const { getProfile, getUser } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { t } = useTranslation();
    const setProfile = useStoreActions((store) => store.setProfile);
    const setUser = useStoreActions((store) => store.setUser);
    useRedirectToHomeIfLogged();

    const onLogin = async (tokens: Tokens) => {
        const resultProfile = await getProfile.execute(tokens.accessToken);
        if (resultProfile instanceof Profile) {
            setProfile({ profile: resultProfile });
            return history.push('/home');
        }

        const resultUser = await getUser.execute(tokens.accessToken);
        if (resultUser instanceof User) {
            setUser({ user: resultUser });
            return history.push('/signup/languages');
        }

        return await showToast(t('errors.userWrongCredentials'), 1000);
    };

    return (
        <IonPage>
            <IonContent>
                {width < HYBRID_MAX_WIDTH ? (
                    <LoginForm goBack={() => history.push('/connect')} onLogin={onLogin} />
                ) : (
                    <WebLayout
                        leftComponent={<WelcomeContent />}
                        rightComponent={<LoginForm goBack={() => history.push('/')} onLogin={onLogin} />}
                    />
                )}
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;
