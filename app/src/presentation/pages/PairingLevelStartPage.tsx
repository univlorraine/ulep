import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import LanguageSelectedContent from '../components/contents/LanguageSelectedContent';
import SuccessLayout from '../components/layout/SuccessLayout';
import styles from './css/SignUp.module.css';
import { AvatarPlaceholderPng } from '../../assets';

const PairingLevelStartPage: React.FC = () => {
    const { configuration } = useConfig();
    const history = useHistory();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const profile = useStoreState((state) => state.profile);
    const user = profile?.user;

    if (!profileSignUp.learningLanguage || !user) {
        return <Redirect to="/signup" />;
    }

    const continueSignUp = async () => {
        if (profileSignUp.learningLanguage?.code === '*') {
            return history.push(`/pairing/preference`);
        }
        return history.push(`/pairing/level`);
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
                    profilePicture={user.avatar ?? AvatarPlaceholderPng}
                    onNextPressed={continueSignUp}
                />
            </div>
        </SuccessLayout>
    );
};

export default PairingLevelStartPage;
