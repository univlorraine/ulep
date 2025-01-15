import { IonContent } from '@ionic/react';
import { Redirect, useHistory } from 'react-router';
import News from '../../../domain/entities/News';
import { useStoreState } from '../../../store/storeTypes';
import NewsListContent from '../../components/contents/news/NewsListContent';

const NewsListPage = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/home');
    };

    const onShowNewsPressed = (news: News) => {
        history.push('show-news', { news });
    };

    return (
        <IonContent>
            <NewsListContent profile={profile} onBackPressed={goBack} onNewsPressed={onShowNewsPressed} />
        </IonContent>
    );
};

export default NewsListPage;
