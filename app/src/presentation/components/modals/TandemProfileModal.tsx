import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import TandemProfile from '../tandems/TandemProfile';
import Modal from './Modal';

interface TandemProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    language?: Language;
    level?: CEFR;
    pedagogy?: Pedagogy;
    profile?: Profile;
}

const TandemProfileModal: React.FC<TandemProfileModalProps> = ({ isVisible, language, level, onClose, pedagogy, profile }) => {
    if (!language || !profile || !level ||!pedagogy) {
        return <div />;
    }

    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <TandemProfile language={language} level={level} onClose={onClose} pedagogy={pedagogy} profile={profile} />
        </Modal>
    );
};

export default TandemProfileModal;
