import { IonButton, IonImg } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import News from '../../../../domain/entities/News';
import Profile from '../../../../domain/entities/Profile';
import HeaderSubContent from '../../HeaderSubContent';
import LanguageTag from '../../LanguageTag';
import ChangeLanguageModal from '../../modals/ChangeLanguageModal';
import CreditModal from '../../modals/CreditModal';
import UniversityTag from '../../UniversityTag';
import styles from './NewsContent.module.css';

interface NewsContentProps {
    profile: Profile;
    news: News;
    onBackPressed: () => void;
}

export const NewsContent: React.FC<NewsContentProps> = ({ news, profile, onBackPressed }) => {
    const { t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(news.languageCode);
    const [currentTitle, setCurrentTitle] = useState(news.title);
    const [currentContent, setCurrentContent] = useState(news.content);
    const [showChangeLanguage, setShowChangeLanguage] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const formattedDate = new Intl.DateTimeFormat(profile.nativeLanguage.code, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(news.startPublicationDate));

    const changeLanguage = (languageCode: string) => {
        if (languageCode === news.languageCode) {
            setCurrentLanguage(news.languageCode);
            setCurrentTitle(news.title);
            setCurrentContent(news.content);
        } else {
            setCurrentLanguage(languageCode);
            setCurrentTitle(
                news.translations.find((translation) => translation.languageCode === languageCode)?.title ?? ''
            );
            setCurrentContent(
                news.translations.find((translation) => translation.languageCode === languageCode)?.content ?? ''
            );
        }
        setShowChangeLanguage(false);
    };

    return (
        <div className="subcontent-container content-wrapper" style={{ padding: 0 }} ref={contentRef}>
            <HeaderSubContent title={t('news.list.title')} onBackPressed={onBackPressed} />
            <div className={styles.container}>
                {news.imageUrl && <IonImg className={styles.image} src={news.imageUrl}></IonImg>}
                {news.creditImage && (
                    <IonButton fill="clear" className={styles['credit-view']} onClick={() => setShowCreditModal(true)}>
                        <span className={styles.credit}>©</span>
                    </IonButton>
                )}
                <div className={styles['primary-container']} style={{ marginTop: news.imageUrl ? 200 : 0 }}>
                    <h1 className={styles.title}>{currentTitle}</h1>
                    <span className={styles.date}>{formattedDate}</span>
                    <div className={styles.informations}>
                        <div className={styles['information-item']}>
                            <span className={styles.label}>{t('news.show.language')}</span>
                            <span>
                                <LanguageTag languageCode={currentLanguage} />
                                {news.translations.length > 0 && (
                                    <button
                                        aria-label={t('news.show.change_language') as string}
                                        className={styles['change-language-button']}
                                        onClick={() => setShowChangeLanguage(true)}
                                    >
                                        {t('news.show.change_language')}
                                    </button>
                                )}
                            </span>
                        </div>
                        <div className={styles['information-item']}>
                            <span className={styles.label}>{t('news.show.author')}</span>
                            <UniversityTag university={news.university} />
                        </div>
                    </div>
                    <p className={styles.content} dangerouslySetInnerHTML={{ __html: currentContent }} />
                </div>
            </div>
            <ChangeLanguageModal
                isVisible={showChangeLanguage}
                onClose={() => setShowChangeLanguage(false)}
                onLanguageCodeChange={changeLanguage}
                currentLanguageCode={currentLanguage}
                allLanguagesCodes={[
                    news.languageCode,
                    ...news.translations.map((translation) => translation.languageCode),
                ]}
            />
            {news.creditImage && (
                <CreditModal
                    isVisible={showCreditModal}
                    onClose={() => setShowCreditModal(false)}
                    credit={news.creditImage}
                />
            )}
        </div>
    );
};

export default NewsContent;
