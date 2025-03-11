import { IonModal } from '@ionic/react';
import News from '../../../domain/entities/News';
import Profile from '../../../domain/entities/Profile';
import NewsContent from '../contents/news/NewsContent';
import NewsListContent from '../contents/news/NewsListContent';
import styles from './ActivitiesContentModal.module.css';

export const DisplayNewsContentModalEnum = {
    show: 'show',
    list: 'list',
};

export interface DisplayNewsContentModal {
    type: (typeof DisplayNewsContentModalEnum)[keyof typeof DisplayNewsContentModalEnum];
    news?: News;
}

interface NewsContentModalProps {
    isVisible: boolean;
    displayNewsContentModal?: DisplayNewsContentModal;
    onClose: () => void;
    onNewsPressed: (news: News) => void;
    profile: Profile;
}

const NewsContentModal: React.FC<NewsContentModalProps> = ({
    isVisible,
    displayNewsContentModal,
    onClose,
    onNewsPressed,
    profile,
}) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.content}>
                {displayNewsContentModal?.type === DisplayNewsContentModalEnum.list && (
                    <NewsListContent profile={profile} onBackPressed={onClose} onNewsPressed={onNewsPressed} />
                )}
                {displayNewsContentModal?.type === DisplayNewsContentModalEnum.show && displayNewsContentModal.news && (
                    <NewsContent news={displayNewsContentModal.news} onBackPressed={onClose} profile={profile} />
                )}
            </div>
        </IonModal>
    );
};

export default NewsContentModal;
