import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import FlagBubble from '../FlagBubble';
import HeaderSubContent from '../HeaderSubContent';
import styles from './SelectLanguageContent.module.css';

interface SelectLanguageContentProps {
    onBackPressed: () => void;
    setSelectedLanguage: (language: Language) => void;
    profile: Profile;
}

const SelectLanguageContent: React.FC<SelectLanguageContentProps> = ({
    onBackPressed,
    setSelectedLanguage,
    profile,
}) => {
    const { t } = useTranslation();
    const languages = profile?.learningLanguages;

    return (
        <div className={styles.container}>
            <HeaderSubContent title={t('sidebar_modal.languages.head_title')} onBackPressed={onBackPressed} />
            <div className={styles.content}>
                <h1 className="title">{t('sidebar_modal.languages.title')}</h1>
                <p className={`text ${styles.text}`}>{t('sidebar_modal.languages.text')}</p>
                <>
                    <div className={styles['languages-container']}>
                        {languages &&
                            languages.length &&
                            languages.map((language) => {
                                return (
                                    <FlagBubble
                                        key={language.code}
                                        role="button"
                                        language={language}
                                        onPressed={setSelectedLanguage}
                                        textColor={'black'}
                                    />
                                );
                            })}
                    </div>
                </>
            </div>
        </div>
    );
};

export default SelectLanguageContent;
