import { IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import News from '../../../domain/entities/News';
import Profile from '../../../domain/entities/Profile';
import LanguageTag from '../LanguageTag';
import UniversityTag from '../UniversityTag';
import styles from './NewsLine.module.css';

interface NewsLineProps {
    news: News;
    profile: Profile;
    onClick: () => void;
}

const NewsLine: React.FC<NewsLineProps> = ({ news, profile, onClick }) => {
    const { t } = useTranslation();
    const formattedDate = new Intl.DateTimeFormat(profile.nativeLanguage.code, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(news.startPublicationDate));

    return (
        <button
            aria-label={t('news.open', { title: news.title }) as string}
            className={styles.container}
            onClick={onClick}
        >
            {news.imageUrl && <IonImg className={styles.image} src={news.imageUrl} />}
            <div className={styles.content}>
                <div className={styles.tags}>
                    <LanguageTag languageCode={news.languageCode} />
                    <UniversityTag university={news.university} />
                </div>
                <span className={styles.date}>{formattedDate}</span>
                <br />
                <span className={styles.title}>{news.title}</span>
            </div>
        </button>
    );
};

export default NewsLine;
