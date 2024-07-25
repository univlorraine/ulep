import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import Language from '../../../domain/entities/Language';
import { useStoreState } from '../../../store/storeTypes';
import QuizzValidatedContent from '../../components/contents/QuizzValidatedContent';
import WebLayoutCentered from '../../components/layout/WebLayoutCentered';
import { compareCEFR } from '../../utils';
import styles from '../css/SignUp.module.css';

type CEFRQuizzEndPageProps = {
    initialCefr: CEFR;
    language: Language;
    level: CEFR;
};

const CEFRQuizzEndPage: React.FC = () => {
    const { configuration, createOrUpdateTestedLanguage } = useConfig();
    const history = useHistory();
    const location = useLocation<CEFRQuizzEndPageProps>();
    const profile = useStoreState((state) => state.profile);
    const { initialCefr, language, level } = location.state;
    const [showToast] = useIonToast();
    const { t } = useTranslation();

    if (!language) {
        return <Redirect to={`/home`} />;
    }

    const isNewLanguage = !(
        profile!.learningLanguages.find((l) => l.code === language.code) ||
        profile!.testedLanguages.find((l) => l.code === language.code)
    );


    const nextStep = async () => {
        const result = await createOrUpdateTestedLanguage.execute(profile!.id, language, level);

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
                    newLevel={compareCEFR(initialCefr, level)}
                    isNewLanguage={isNewLanguage}
                    language={language}
                    onNextStep={nextStep}
                    quizzLevel={level}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default CEFRQuizzEndPage;
