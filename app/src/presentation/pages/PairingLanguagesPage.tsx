import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import useGetLearnableLanguages from '../hooks/useGetLearnableLanguages';
import LearnableLanguagesContent from '../components/contents/LearnableLanguagesContent';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import { useConfig } from '../../context/ConfigurationContext';

const PairingLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const history = useHistory();
    const { configuration } = useConfig();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profile = useStoreState((state) => state.profile);
    const university = profile?.user.university;

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    const { error, isLoading, languages } = useGetLearnableLanguages(university, false, []);

    if (error) {
        showToast({ message: t(error.message), duration: 1000 });
    }

    const continueSignUp = async (selectedLanguage: Language) => {
        updateProfileSignUp({ learningLanguage: selectedLanguage });

        return history.push(`/pairing/pedagogy`);
    };

    const navigateToHome = () => {
        return history.push('/home');
    };

    const otherLanguages = () => {
        return history.push(`/pairing/other-languages`);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={12}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <LearnableLanguagesContent
                    abortStep={navigateToHome}
                    isLoading={isLoading}
                    languages={languages}
                    navigateToOtherLanguages={otherLanguages}
                    nextStep={continueSignUp}
                    university={university}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingLanguagesPage;
