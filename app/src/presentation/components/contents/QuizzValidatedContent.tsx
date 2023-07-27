import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import FlagBubble from '../FlagBubble';
import styles from './QuizzValidatedContent.module.css';

interface QuizzValidatedContentProps {
    language: Language;
    onNextQuizz?: () => void;
    onNextStep?: () => void;
    quizzLevel: string;
}

const QuizzValidatedContent: React.FC<QuizzValidatedContentProps> = ({
    language,
    onNextQuizz,
    onNextStep,
    quizzLevel,
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h1 className="title">{`${t(`pairing_quizz_validation.title`)}`}</h1>
            {onNextStep && <p className="subtitle">{t(`pairing_quizz_validation.subtitle`)}</p>}
            <div className={styles['image-container']}>
                <img className={styles.image} alt="avatar" src="/assets/trophie.svg"></img>
                <div className={styles.bubble}>
                    <FlagBubble language={language} textColor="white" isSelected disabled />
                </div>
            </div>
            <div className={styles['level-container']}>
                <img alt="quizz" src="/assets/quizz.svg" />
                {`${quizzLevel} ${t('pairing_quizz_validation.validated')}`}
            </div>
            <p className={styles.description}>
                {onNextStep
                    ? t('pairing_quizz_validation.description_next_step')
                    : t('pairing_quizz_validation.description')}
            </p>
            {onNextQuizz && (
                <button className="secondary-button" onClick={onNextQuizz}>
                    {t('pairing_quizz_validation.next_button')}
                </button>
            )}
            {onNextStep && (
                <button className="primary-button" onClick={onNextStep}>
                    {t('pairing_quizz_validation.next_step_button')}
                </button>
            )}
        </div>
    );
};

export default QuizzValidatedContent;
