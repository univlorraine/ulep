import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import News from '../../../domain/entities/News';
import { useStoreState } from '../../../store/storeTypes';
import NewsContent from '../../components/contents/news/NewsContent';

interface NewsShowPageProps {
    news: News;
}

const NewsShowPage = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const location = useLocation<NewsShowPageProps>();
    const { news } = location.state;
    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/news');
    };

    return (
        <IonContent>
            <NewsContent news={news} profile={profile} onBackPressed={goBack} />
        </IonContent>
    );
};

export default NewsShowPage;
