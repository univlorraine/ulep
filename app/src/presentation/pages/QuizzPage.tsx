import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import Question from '../../domain/entities/Question';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import QuizzContent from '../components/contents/QuizzContent';
import QuizzSelectionContent from '../components/contents/QuizzSelectionContent';
import QuizzValidatedContent from '../components/contents/QuizzValidatedContent';
import SuccessLayout from '../components/layout/SuccessLayout';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import Loader from '../components/Loader';
import { getNextLevel, getPreviousLevel } from '../utils';
import styles from './css/SignUp.module.css';

type QuizzPageProps = {
    initialCefr?: CEFR;
    isQuizzTest?: boolean;
    language?: Language;
};

const QuizzPage: React.FC = () => {
    const { configuration, getQuizzByLevel, deviceAdapter } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { t } = useTranslation();
    const location = useLocation<QuizzPageProps>();
    const { initialCefr, isQuizzTest, language } = location.state || {
        initialCefr: undefined,
        isQuizzTest: false,
        language: undefined,
    };
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuizz, setCurrentQuizz] = useState<CEFR | undefined>();
    const [displayNextQuizz, setDisplayNextQuizz] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(Boolean(initialCefr));

    if (!profileSignUp.learningLanguage && !language) {
        return <Redirect to={`/pairing/languages`} />;
    }

    const askQuizz = async (level: CEFR | undefined) => {
        if (!level) {
            return;
        }
        setIsLoading(true);

        const result = await getQuizzByLevel.execute(level);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 5000 });
        }

        setQuestions(result);
        setDisplayNextQuizz(false);
        setIsLoading(false);
        return setCurrentQuizz(level);
    };

    const onQuizzOver = (percentage: number) => {
        if (!currentQuizz) {
            return;
        }

        if (percentage >= 80 && currentQuizz !== 'C2') {
            return setDisplayNextQuizz(true);
        }

        let level = currentQuizz;

        if (percentage < 10 && currentQuizz === 'A1') {
            level = 'A0';
        } else if (percentage < 80) {
            level = getPreviousLevel(currentQuizz);
        }

        if (isQuizzTest) {
            return history.push(`/cefr/quizz/end`, { initialCefr, language, level });
        }

        updateProfileSignUp({ learningLanguageLevel: level });

        return history.push(`/pairing/language/quizz/end`);
    };

    useEffect(() => {
        if (initialCefr) {
            askQuizz(initialCefr !== 'A0' ? initialCefr : 'A1');
        }
    }, [initialCefr]);

    if (displayNextQuizz && currentQuizz) {
        return (
            <SuccessLayout
                backgroundColorCode={configuration.secondaryDarkColor}
                backgroundIconColor={configuration.secondaryBackgroundImageColor}
                colorCode={configuration.secondaryColor}
            >
                <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                    <QuizzValidatedContent
                        language={profileSignUp.learningLanguage || language!}
                        onNextQuizz={() => askQuizz(getNextLevel(currentQuizz))}
                        quizzLevel={currentQuizz}
                    />
                </div>
            </SuccessLayout>
        );
    }

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={initialCefr ? 100 : 60}
            headerTitle={initialCefr ? t('global.cefr_quizz_title') : t('global.pairing_title')}
        >
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                {isLoading ? (
                    <div className={styles.loader}>
                        <Loader />
                    </div>
                ) : (
                    <>
                        {questions.length === 0 && <QuizzSelectionContent onQuizzSelected={askQuizz} />}
                        {questions.length > 0 && currentQuizz && (
                            <QuizzContent onQuizzOver={onQuizzOver} questions={questions} quizzLevel={currentQuizz} />
                        )}
                    </>
                )}
            </div>
        </WebLayoutCentered>
    );
};

export default QuizzPage;
