import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import FlagBubble from '../FlagBubble';
import styles from './QuizzValidatedContent.module.css';

interface QuizzValidatedContentProps {
    language: Language;
    onNextQuizz: () => void;
    quizzLevel: string;
}

const QuizzValidatedContent: React.FC<QuizzValidatedContentProps> = ({ language, onNextQuizz, quizzLevel }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h1 className="title">{`${t(`pairing_quizz_validated_page.title`)}`}</h1>
            <div className={styles['image-container']}>
                <img className={styles.image} alt="avatar" src="/assets/trophie.svg"></img>
                <div className={styles.bubble}>
                    <FlagBubble language={language} textColor="white" isSelected disabled />
                </div>
            </div>
            <div className={styles['level-container']}>
                <img alt="quizz" src="/assets/quizz.svg" />
                {`${quizzLevel} ${t('pairing_quizz_validated_page.validated')}`}
            </div>
            <p className={styles.description}>{t('pairing_quizz_validated_page.description')}</p>
            <button className="secondary-button" onClick={onNextQuizz}>
                {t('pairing_quizz_validated_page.next_button')}
            </button>
        </div>
    );
};

export default QuizzValidatedContent;
