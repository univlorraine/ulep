import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import TandemProfile from '../tandems/TandemProfile';
import Modal from './Modal';

interface TandemProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    language?: Language;
    level?: CEFR;
    partnerLearningLanguage?: Language;
    pedagogy?: Pedagogy;
    profile?: Profile;
}

const TandemProfileModal: React.FC<TandemProfileModalProps> = ({ isVisible, language, level, onClose, partnerLearningLanguage, pedagogy, profile }) => {
    if (!language || !profile || !level ||!pedagogy || !partnerLearningLanguage) {
        return <div />;
    }

    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <TandemProfile language={language} level={level} onClose={onClose} partnerLearningLanguage={partnerLearningLanguage} pedagogy={pedagogy} profile={profile} />
        </Modal>
    );
};

export default TandemProfileModal;
