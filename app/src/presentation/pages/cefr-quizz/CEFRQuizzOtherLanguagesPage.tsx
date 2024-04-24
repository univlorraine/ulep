import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import Language from '../../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../../store/storeTypes';
import OtherLanguageContent from '../../components/contents/OtherLanguageContent';
import WebLayoutCentered from '../../components/layout/WebLayoutCentered';
import styles from '../css/SignUp.module.css';
import useGetSuggestedLanguages from '../../hooks/useGetSuggestedLanguages';

const PairingOtherLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const [showToast] = useIonToast();
    const profile = useStoreState((state) => state.profile);
    const university = profile?.user.university;
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const history = useHistory();

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    const { error, languages } = useGetSuggestedLanguages(true, []);

    if (error) {
        showToast({ message: t(error.message), duration: 1000 });
    }

    const onOtherLanguageSelected = async (selectedLanguage: Language) => {
        const languageLevel = [...profile.learningLanguages, ...profile.testedLanguages].find(
            (language) => language.code === selectedLanguage?.code
        )?.level;

        return history.push(`/cefr/quizz`, {
            initialCefr: languageLevel ?? undefined,
            isQuizzTest: true,
            language: selectedLanguage,
        });
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={100}
            headerTitle={t('global.cefr_quizz_title')}
        >
            <div className={styles.body}>
                <OtherLanguageContent
                    displayJoker={false}
                    languages={languages}
                    onLanguageSelected={onOtherLanguageSelected}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingOtherLanguagesPage;
