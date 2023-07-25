import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import Question from '../../domain/entities/Question';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import SuccessLayout from '../components/SuccessLayout';
import WebLayoutCentered from '../components/WebLayoutCentered';
import QuizzContent from '../components/contents/QuizzContent';
import QuizzSelectionContent from '../components/contents/QuizzSelectionContent';
import QuizzValidatedContent from '../components/contents/QuizzValidatedContent';
import { getNextLevel, getPreviousLevel } from '../utils';
import styles from './css/SignUp.module.css';

const PairingQuizzPage = () => {
    const { configuration, getQuizzByLevel } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { t } = useTranslation();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuizz, setCurrentQuizz] = useState<string>('');
    const [displayNextQuizz, setDisplayNextQuizz] = useState<boolean>(false);

    if (!profileSignUp.learningLanguage) {
        return <Redirect to="/signup/pairing/languages" />;
    }

    // @ts-ignore
    const learningLanguage = new Language(profileSignUp.learningLanguage._code, profileSignUp.learningLanguage._name);

    const askQuizz = async (level: string | undefined) => {
        if (!level) {
            return;
        }

        const result = await getQuizzByLevel.execute(level);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 5000 });
        }

        setQuestions(result);
        setDisplayNextQuizz(false);
        return setCurrentQuizz(level);
    };

    const onQuizzOver = (percentage: number) => {
        if (!currentQuizz) {
            return;
        }

        if (percentage >= 80 && currentQuizz !== 'C1') {
            return setDisplayNextQuizz(true);
        }

        if (percentage < 10 && currentQuizz === 'A1') {
            updateProfileSignUp({ learningLanguageLevel: 'A0' });
        }

        if (percentage < 80) {
            updateProfileSignUp({ learningLanguageLevel: getPreviousLevel(currentQuizz) });
        }

        if (percentage >= 80 && currentQuizz === 'C1') {
            updateProfileSignUp({ learningLanguageLevel: 'C2' });
        }

        return history.push('/signup/pairing/language/quizz/end');
    };

    if (displayNextQuizz) {
        return (
            <SuccessLayout
                backgroundColorCode={configuration.secondaryDarkColor}
                backgroundIconColor={configuration.secondaryBackgroundImageColor}
                colorCode={configuration.secondaryColor}
            >
                <div className={styles.body}>
                    <QuizzValidatedContent
                        language={learningLanguage}
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
            headerPercentage={60}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                {questions.length === 0 && <QuizzSelectionContent onQuizzSelected={askQuizz} />}
                {questions.length > 0 && currentQuizz && (
                    <QuizzContent onQuizzOver={onQuizzOver} questions={questions} quizzLevel={currentQuizz} />
                )}
            </div>
        </WebLayoutCentered>
    );
};

export default PairingQuizzPage;
