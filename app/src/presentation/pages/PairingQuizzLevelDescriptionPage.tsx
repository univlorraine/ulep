import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import Question from '../../domain/entities/Question';
import WebLayoutCentered from '../components/WebLayoutCentered';
import QuizzContent from '../components/contents/QuizzContent';
import QuizzSelectionContent from '../components/contents/QuizzSelectionContent';
import styles from './css/SignUp.module.css';

const PairingQuizzLevelDescriptionPage = () => {
    const { configuration, getQuizzByLevel } = useConfig();
    const [showToast] = useIonToast();
    const { t } = useTranslation();
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
                    <QuizzContent questions={questions} quizzLevel={currentQuizz} />
                )}
            </div>
        </WebLayoutCentered>
    );
};

export default PairingQuizzLevelDescriptionPage;
