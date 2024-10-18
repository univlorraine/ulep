import News from '../../../domain/entities/News';
import Profile from '../../../domain/entities/Profile';
import useNews from '../../hooks/useGetNewsList';
import NewsListContent from '../contents/news/NewsListContent';
import Modal from './Modal';

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
    profile: Profile;
}

const NewsContentModal: React.FC<NewsContentModalProps> = ({
    isVisible,
    displayNewsContentModal,
    onClose,
    profile,
}) => {
    const { news, searchTitle, setSearchTitle } = useNews();
    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            <>
                {displayNewsContentModal?.type === DisplayNewsContentModalEnum.list && (
                    <NewsListContent
                        news={news}
                        profile={profile}
                        setSearchTitle={setSearchTitle}
                        onBackPressed={onClose}
                        searchTitle={searchTitle}
                    />
                )}
            </>
        </Modal>
    );
};

export default NewsContentModal;
