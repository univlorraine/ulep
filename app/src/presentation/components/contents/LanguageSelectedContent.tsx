import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import FlagBubble from '../FlagBubble';
import styles from './LanguageSelectedContent.module.css';
import Avatar from '../Avatar';
import User from '../../../domain/entities/User';

interface LanguageSelectedContentProps {
    language: Language;
    mode: 'confirm' | 'unavailable';
    user: User;
    onNextPressed: () => void;
}

const LanguageSelectedContent: React.FC<LanguageSelectedContentProps> = ({ language, mode, user, onNextPressed }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h1 className="title">{`${t(`pairing_${mode}_language_page.not_alone.title`)}`}</h1>
            <span className="subtitle">{`${t(`pairing_${mode}_language_page.not_alone.subtitle`)}`}</span>
            <div className={styles['image-container']}>
                <Avatar user={user} className={styles.image} />
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
                <button
                    aria-label={t(`pairing_${mode}_language_page.not_alone.validate_button`) as string}
                    className={'primary-button large-margin-top'}
                    onClick={onNextPressed}
                >
                    {t(`pairing_${mode}_language_page.not_alone.validate_button`)}
                </button>
            </div>
        </div>
    );
};

export default LanguageSelectedContent;
