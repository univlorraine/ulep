import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import QuizzValidatedContent from '../components/contents/QuizzValidatedContent';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import { useIonToast } from '@ionic/react';
import { compareCEFR } from '../utils';

type PairingQuizzEndPageProps = {
    isProficiencyTest: boolean;
    isNewLanguage: boolean;
    languageLevel: CEFR;
};

const PairingQuizzEndPage: React.FC = () => {
    const { configuration, createOrUpdateTestedLanguage } = useConfig();
    const history = useHistory();
    const location = useLocation<PairingQuizzEndPageProps>();
    const profile = useStoreState((state) => state.profile);
    const { isProficiencyTest, isNewLanguage, languageLevel } = location.state;
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [showToast] = useIonToast();
    const { t } = useTranslation();

    if (!profileSignUp.learningLanguage || !profileSignUp.learningLanguageLevel) {
        return <Redirect to={`/pairing/languages`} />;
    }

    const nextStep = async () => {
        if (isProficiencyTest) {
            const result = await createOrUpdateTestedLanguage.execute(
                profile!.id,
                profileSignUp.learningLanguage!,
                profileSignUp.learningLanguageLevel!
            );
            if (result instanceof Error) {
                return await showToast({ message: t(result.message), duration: 1000 });
            }

            return history.push(`/home`);
        }
        return history.push(`/pairing/preference`);
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
                    newLevel={
                        isProficiencyTest && languageLevel
                            ? compareCEFR(languageLevel, profileSignUp.learningLanguageLevel)
                            : undefined
                    }
                    isNewLanguage={isNewLanguage}
                    language={profileSignUp.learningLanguage}
                    onNextStep={nextStep}
                    quizzLevel={profileSignUp.learningLanguageLevel}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingQuizzEndPage;
