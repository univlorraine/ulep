import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Question from '../../domain/entities/Question';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/WebLayoutCentered';
import QuizzContent from '../components/contents/QuizzContent';
import QuizzSelectionContent from '../components/contents/QuizzSelectionContent';
import styles from './css/SignUp.module.css';

const getPreviousLevel = (level: string) => {
    switch (level) {
        case 'A1':
            return 'A0';
        case 'A2':
            return 'A1';
        case 'B1':
            return 'A2';
        case 'B2':
            return 'B1';
        case 'C1':
            return 'B2';
        case 'C2':
            return 'C1';
        default:
            return 'A0';
    }
};

const getNextLevel = (level: string) => {
    switch (level) {
        case 'A0':
            return 'A1';
        case 'A1':
            return 'A2';
        case 'A2':
            return 'B1';
        case 'B1':
            return 'B2';
        case 'B2':
            return 'C1';
        case 'C1':
            return 'C2';
        default:
            return 'A0';
    }
};

const PairingQuizzLevelDescriptionPage = () => {
    const { configuration, getQuizzByLevel } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { t } = useTranslation();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuizz, setCurrentQuizz] = useState<string>();

    const askQuizz = async (level: string | undefined) => {
        if (!level) {
            return;
        }

        const result = await getQuizzByLevel.execute(level);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 5000 });
        }

        setQuestions(result);
        return setCurrentQuizz(level);
    };

    const onQuizzOver = (percentage: number) => {
        if (!currentQuizz) {
            return;
        }

        if (percentage >= 80 && currentQuizz !== 'C1') {
            return;
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

export default PairingQuizzLevelDescriptionPage;
