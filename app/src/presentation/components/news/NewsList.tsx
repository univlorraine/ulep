import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import News from '../../../domain/entities/News';
import Profile from '../../../domain/entities/Profile';
import NewsLine from './NewsLine';

interface NewsListProps {
    news: News[];
    profile: Profile;
    onNewsPressed: (news?: News) => void;
}

const NewsList: React.FC<NewsListProps> = ({ news, profile, onNewsPressed }) => {
    const { t } = useTranslation();
    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.news.title')}</span>
            {news.map((newsItem: News) => (
                <NewsLine key={newsItem.id} news={newsItem} profile={profile} onClick={() => onNewsPressed(newsItem)} />
            ))}
            <IonButton fill="clear" className="primary-button" onClick={() => onNewsPressed()}>
                {t('home_page.news.see_all')}
            </IonButton>
        </div>
    );
};

export default NewsList;
