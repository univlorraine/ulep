import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreState } from '../../../store/storeTypes';
import QuizzValidatedContent from '../../components/contents/QuizzValidatedContent';
import WebLayoutCentered from '../../components/layout/WebLayoutCentered';
import styles from '../css/SignUp.module.css';
import { useIonToast } from '@ionic/react';
import { compareCEFR } from '../../utils';

type CEFRQuizzEndPageProps = {
    initialCefr: CEFR;
};

const CEFRQuizzEndPage: React.FC = () => {
    const { configuration, createOrUpdateTestedLanguage } = useConfig();
    const history = useHistory();
    const location = useLocation<CEFRQuizzEndPageProps>();
    const profile = useStoreState((state) => state.profile);
    const { initialCefr } = location.state;
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [showToast] = useIonToast();
    const { t } = useTranslation();

    if (!profileSignUp.learningLanguage || !profileSignUp.learningLanguageLevel) {
        return <Redirect to={`/pairing/languages`} />;
    }

    const isNewLanguage = !(
        profile!.learningLanguages.find((language) => language.code === profileSignUp.learningLanguage?.code) ||
        profile!.testedLanguages.find((language) => language.code === profileSignUp.learningLanguage?.code)
    );

    const nextStep = async () => {
        const result = await createOrUpdateTestedLanguage.execute(
            profile!.id,
            profileSignUp.learningLanguage!,
            profileSignUp.learningLanguageLevel!
        );

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return history.push(`/home`);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={100}
            headerTitle={t('global.cefr_quizz_title')}
        >
            <div className={styles.body}>
                <QuizzValidatedContent
                    newLevel={compareCEFR(initialCefr, profileSignUp.learningLanguageLevel)}
                    isNewLanguage={isNewLanguage}
                    language={profileSignUp.learningLanguage}
                    onNextStep={nextStep}
                    quizzLevel={profileSignUp.learningLanguageLevel}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default CEFRQuizzEndPage;
