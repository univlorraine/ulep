import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import TandemProfile from '../tandems/TandemProfile';
import Modal from './Modal';

interface TandemProfileModalProps {
    id?: string;
    isVisible: boolean;
    onClose: () => void;
    language?: Language;
    level?: CEFR;
    partnerLearningLanguage?: Language;
    pedagogy?: Pedagogy;
    profile?: Profile;
}

const TandemProfileModal: React.FC<TandemProfileModalProps> = ({
    id,
    isVisible,
    language,
    level,
    onClose,
    partnerLearningLanguage,
    pedagogy,
    profile,
}) => {
    if (!id || !language || !profile || !level || !pedagogy || !partnerLearningLanguage) {
        return <div />;
    }

    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <TandemProfile
                id={id}
                language={language}
                level={level}
                onClose={onClose}
                partnerLearningLanguage={partnerLearningLanguage}
                pedagogy={pedagogy}
                profile={profile}
            />
        </Modal>
    );
};

export default TandemProfileModal;
