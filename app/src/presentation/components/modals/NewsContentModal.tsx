import Profile from '../../../domain/entities/Profile';
import useNews from '../../hooks/useGetNewsList';
import NewsListContent from '../contents/news/NewsListContent';
import Modal from './Modal';

interface NewsContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
}

const NewsContentModal: React.FC<NewsContentModalProps> = ({ isVisible, onClose, profile }) => {
    const { news, searchTitle, setSearchTitle } = useNews();
    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            <NewsListContent
                news={news}
                profile={profile}
                setSearchTitle={setSearchTitle}
                onBackPressed={onClose}
                searchTitle={searchTitle}
            />
        </Modal>
    );
};

export default NewsContentModal;
