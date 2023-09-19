import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useParams } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import QuizzValidatedContent from '../components/contents/QuizzValidatedContent';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import { useIonToast } from '@ionic/react';

const PairingQuizzEndPage: React.FC = ({}) => {
    const { configuration, askForLearningLanguage } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const isSignUp = useParams<{ prefix?: string }>().prefix;
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const updateProfile = useStoreActions((state) => state.updateProfile);
    const profile = useStoreState((state) => state.profile);
    const { t } = useTranslation();

    if (!profileSignUp.learningLanguage || !profileSignUp.learningLanguageLevel) {
        return <Redirect to={`${isSignUp ? '/' + isSignUp : ''}/pairing/languages`} />;
    }

    const nextStep = async () => {
        if (isSignUp) {
            return history.push('signup/pairing/preference');
        }

        if (!profileSignUp.learningLanguage || !profileSignUp.learningLanguageLevel) {
            return await showToast({ message: t('errors.global'), duration: 1000 });
        }

        const result = await askForLearningLanguage.execute(
            profile!.id,
            profileSignUp.learningLanguage,
            profileSignUp.learningLanguageLevel
        );

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        updateProfile({ learningLanguage: result });

        return (window.location.href = '/home');
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={72}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <QuizzValidatedContent
                    language={profileSignUp.learningLanguage}
                    onNextStep={nextStep}
                    quizzLevel={profileSignUp.learningLanguageLevel}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingQuizzEndPage;
