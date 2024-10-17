import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import News from '../../../domain/entities/News';
import NewsLine from './NewsLine';

interface NewsListProps {
    news: News[];
}

const NewsList: React.FC<NewsListProps> = ({ news }) => {
    const { t } = useTranslation();
    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.news.title')}</span>
            {news.map((newsItem) => (
                <NewsLine key={newsItem.id} news={newsItem} />
            ))}
            <IonButton fill="clear" className="primary-button">
                {t('home_page.news.see_all')}
            </IonButton>
        </div>
    );
};

export default NewsList;
