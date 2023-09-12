import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import TandemProfile from '../tandems/TandemProfile';
import Modal from './Modal';

interface TandemProfileModalProps {
    isVisible: boolean;
    language?: Language;
    onClose: () => void;
    profile?: Profile;
}

const TandemProfileModal: React.FC<TandemProfileModalProps> = ({ isVisible, language, onClose, profile }) => {
    if (!language || !profile) {
        return <div />;
    }

    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <TandemProfile language={language} onClose={onClose} profile={profile} />
        </Modal>
    );
};

export default TandemProfileModal;
