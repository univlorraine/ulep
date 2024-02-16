import { IonPage, useIonToast } from '@ionic/react';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Profile from '../../domain/entities/Profile';
import User from '../../domain/entities/User';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WelcomeContent from '../components/contents/WelcomeContent';
import LoginForm from '../components/forms/LoginForm';
import WebLayout from '../components/layout/WebLayout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import Tokens from '../../domain/entities/Tokens';
import { useTranslation } from 'react-i18next';

const LoginPage: React.FC = () => {
    const { width } = useWindowDimensions();
    const { getProfile, getUser } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { t } = useTranslation();
    const setProfile = useStoreActions((store) => store.setProfile);
    const setUser = useStoreActions((store) => store.setUser);
    const token = useStoreState((state) => state.accessToken);

    if (token) window.location.href = '/home';

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
            {width < HYBRID_MAX_WIDTH ? (
                <LoginForm goBack={() => history.push('/connect')} onLogin={onLogin} />
            ) : (
                <WebLayout
                    leftComponent={<WelcomeContent />}
                    rightComponent={<LoginForm goBack={() => history.push('/')} onLogin={onLogin} />}
                />
            )}
        </IonPage>
    );
};

export default LoginPage;
