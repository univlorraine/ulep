import { useTranslation } from 'react-i18next';
import { QuizzPng, TrophiePng } from '../../../assets';
import Language from '../../../domain/entities/Language';
import FlagBubble from '../FlagBubble';
import styles from './QuizzValidatedContent.module.css';
import confetti from '../../../assets/animations/confetti.json';
import Lottie from 'react-lottie';

interface QuizzValidatedContentProps {
    language: Language;
    onNextQuizz?: () => void;
    onNextStep?: () => void;
    quizzLevel: string;
    newLevel?: number;
    isNewLanguage?: boolean;
}

const QuizzValidatedContent: React.FC<QuizzValidatedContentProps> = ({
    language,
    onNextQuizz,
    onNextStep,
    quizzLevel,
    newLevel,
    isNewLanguage,
}) => {
    const { t } = useTranslation();

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: confetti,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div className={styles.container}>
            <h1 className="title">{`${t(`pairing_quizz_validation.title`)}`}</h1>
            {newLevel === undefined && onNextStep && (
                <p className="subtitle">{t(`pairing_quizz_validation.subtitle`)}</p>
            )}
            <div className={styles['image-container']}>
                <img className={styles.image} alt="" src={TrophiePng} />
                <div className={styles.bubble}>
                    <FlagBubble language={language} textColor="white" isSelected disabled />
                </div>
                {!isNewLanguage && !!newLevel && (
                    <div className={styles['bubble-cefr']}>{`${newLevel >= 1 ? '+' : ''}${newLevel}`}</div>
                )}
            </div>
            <div className={styles['level-container']}>
                <img alt="" src={QuizzPng} />
                {`${quizzLevel} ${t('pairing_quizz_validation.validated')}`}
            </div>
            <p className={styles.description}>
                {onNextStep
                    ? t(`pairing_quizz_validation.description_next_step.${quizzLevel}`)
                    : t('pairing_quizz_validation.description')}
            </p>
            {onNextQuizz && (
                <button
                    aria-label={t('pairing_quizz_validation.next_button') as string}
                    className="secondary-button"
                    onClick={onNextQuizz}
                >
                    {t('pairing_quizz_validation.next_button')}
                </button>
            )}
            {onNextStep && (
                <button
                    aria-label={t('pairing_quizz_validation.next_step_button') as string}
                    className={`primary-button ${styles.button}`}
                    onClick={onNextStep}
                >
                    {t('pairing_quizz_validation.next_step_button')}
                </button>
            )}
            {!!newLevel && newLevel > 0 && (
                <div className={styles.animation}>
                    <Lottie options={defaultOptions} height="100%" width="100%" />
                </div>
            )}
        </div>
    );
};

export default QuizzValidatedContent;
