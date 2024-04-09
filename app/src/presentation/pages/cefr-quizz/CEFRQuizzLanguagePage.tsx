import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import Language from '../../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../../store/storeTypes';
import useGetLearnableLanguages from '../../hooks/useGetLearnableLanguages';
import LearnableLanguagesContent from '../../components/contents/LearnableLanguagesContent';
import WebLayoutCentered from '../../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import { useConfig } from '../../../context/ConfigurationContext';

const CEFRQuizzLanguagePage: React.FC = () => {
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

    const { error, isLoading, languages } = useGetLearnableLanguages(university, true);

    if (error) {
        showToast({ message: t(error.message), duration: 1000 });
    }

    const startTest = async (selectedLanguage: Language) => {
        const languageLevel = [...profile.learningLanguages, ...profile.testedLanguages].find(
            (language) => language.code === selectedLanguage?.code
        )?.level;

        updateProfileSignUp({ learningLanguage: selectedLanguage });

        return history.push(`/cefr/quizz`, { cefrToTest: languageLevel ?? 'A1' });
    };

    const navigateToHome = () => {
        return history.push('/home');
    };

    const otherLanguages = () => {
        return history.push(`/cefr/languages/other`);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={100}
            headerTitle={t('global.cefr_quizz_title')}
        >
            <div className={styles.body}>
                <LearnableLanguagesContent
                    abortStep={navigateToHome}
                    isLoading={isLoading}
                    languages={languages}
                    navigateToOtherLanguages={otherLanguages}
                    nextStep={startTest}
                    university={university}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default CEFRQuizzLanguagePage;
