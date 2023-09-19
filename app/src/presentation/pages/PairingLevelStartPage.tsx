import { Redirect, useHistory, useParams } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import LanguageSelectedContent from '../components/contents/LanguageSelectedContent';
import SuccessLayout from '../components/layout/SuccessLayout';
import styles from './css/SignUp.module.css';

const PairingLevelStartPage: React.FC = () => {
    const { configuration } = useConfig();
    const history = useHistory();
    const isSignUp = useParams<{ prefix?: string }>().prefix;
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const userSignUp = useStoreState((state) => state.user);
    const profile = useStoreState((state) => state.profile);
    const user = userSignUp || profile?.user;

    if (!profileSignUp.learningLanguage || !user) {
        return <Redirect to="/signup" />;
    }

    const continueSignUp = async () => {
        if (profileSignUp.learningLanguage?.code === '*') {
            return history.push(`${isSignUp ? '/' + isSignUp : ''}/pairing/preference`);
        }
        return history.push(`${isSignUp ? '/' + isSignUp : ''}/pairing/level`);
    };

    return (
        <SuccessLayout
            backgroundColorCode={configuration.secondaryDarkColor}
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            colorCode={configuration.secondaryColor}
        >
            <div className={styles.body}>
                <LanguageSelectedContent
                    language={profileSignUp.learningLanguage}
                    mode="confirm"
                    profilePicture={user.avatar}
                    onNextPressed={continueSignUp}
                />
            </div>
        </SuccessLayout>
    );
};

export default PairingLevelStartPage;
