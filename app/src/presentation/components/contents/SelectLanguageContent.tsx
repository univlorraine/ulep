import { useTranslation } from 'react-i18next';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import FlagBubble from '../FlagBubble';
import HeaderSubContent from '../HeaderSubContent';
import styles from './SelectLanguageContent.module.css';

interface SelectLanguageContentProps {
    onBackPressed: () => void;
    setSelectedLanguage: (language: LearningLanguage) => void;
    profile: Profile;
}

const SelectLanguageContent: React.FC<SelectLanguageContentProps> = ({
    onBackPressed,
    setSelectedLanguage,
    profile,
}) => {
    const { t } = useTranslation();
    const learningLanguages = profile?.learningLanguages;

    return (
        <div className={styles.container}>
            <HeaderSubContent title={t('sidebar_modal.languages.head_title')} onBackPressed={onBackPressed} />
            <div className={styles.content}>
                <h1 className="title">{t('sidebar_modal.languages.title')}</h1>
                <p className={`text ${styles.text}`}>{t('sidebar_modal.languages.text')}</p>
                <div className={styles['languages-container']}>
                    {learningLanguages &&
                        learningLanguages.length &&
                        learningLanguages.map((learningLanguage) => {
                            return (
                                <FlagBubble
                                    key={learningLanguage.code}
                                    role="button"
                                    language={learningLanguage}
                                    onPressed={() => setSelectedLanguage(learningLanguage)}
                                    textColor="black"
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default SelectLanguageContent;
