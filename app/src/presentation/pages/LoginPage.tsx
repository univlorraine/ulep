import { IonPage } from '@ionic/react';
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
import { useEffect } from 'react';

const LoginPage: React.FC = () => {
    const { width } = useWindowDimensions();
    const { getProfile, getUser } = useConfig();
    const history = useHistory();
    const setProfile = useStoreActions((store) => store.setProfile);
    const token = useStoreState((store) => store.accessToken);
    const setUser = useStoreActions((store) => store.setUser);

    const onLogin = async () => {
        const resultProfile = await getProfile.execute();
        if (resultProfile instanceof Profile) {
            setProfile({ profile: resultProfile });
            return history.push('/home');
        }

        const resultUser = await getUser.execute();
        if (resultUser instanceof User) {
            setUser({ user: resultUser });
            return history.push('/signup/languages');
        }
    };

    useEffect(() => {
        if (token) {
            onLogin();
        }
    }, [token]);

    return (
        <IonPage>
            {width < HYBRID_MAX_WIDTH ? (
                <LoginForm goBack={() => history.push('/connect')} />
            ) : (
                <WebLayout
                    leftComponent={<WelcomeContent />}
                    rightComponent={<LoginForm goBack={() => history.push('/')} />}
                />
            )}
        </IonPage>
    );
};

export default LoginPage;
