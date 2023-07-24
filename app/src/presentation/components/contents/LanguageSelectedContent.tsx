import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import FlagBubble from '../FlagBubble';
import styles from './LanguageSelectedContent.module.css';

interface LanguageSelectedContentProps {
    language: Language;
    mode: 'confirm' | 'unavailable';
    profilePicture: string;
    onNextPressed: () => void;
}

const LanguageSelectedContent: React.FC<LanguageSelectedContentProps> = ({
    language,
    mode,
    profilePicture,
    onNextPressed,
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{`${t(`pairing_${mode}_language_page.not_alone.title`)}`}</h1>
            <span className={styles.subtitle}>{`${t(`pairing_${mode}_language_page.not_alone.subtitle`)}`}</span>
            <div className={styles['image-container']}>
                <img className={styles.image} alt="avatar" src={profilePicture}></img>
                <div className={styles.bubble}>
                    <FlagBubble language={language} textColor="white" isSelected disabled />
                </div>
            </div>
            <div className={styles['button-container']}>
                {mode === 'confirm' && (
                    <h1 className={styles['description-title']}>
                        {t(`pairing_${mode}_language_page.not_alone.description_title`)}
                    </h1>
                )}
                <p className={styles.description}>{t(`pairing_${mode}_language_page.not_alone.description`)}</p>
                <button className={'primary-button large-margin-top'} onClick={onNextPressed}>
                    {t(`pairing_${mode}_language_page.not_alone.validate_button`)}
                </button>
            </div>
        </div>
    );
};

export default LanguageSelectedContent;
