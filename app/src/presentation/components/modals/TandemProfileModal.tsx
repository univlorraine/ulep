import Language from '../../../domain/entities/Language';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import TandemProfile from '../tandems/TandemProfile';
import Modal from './Modal';

interface TandemProfileModalProps {
    id?: string;
    isVisible: boolean;
    onClose: () => void;
    learningLanguage?: LearningLanguage;
    level?: CEFR;
    partnerLearningLanguage?: Language;
    pedagogy?: Pedagogy;
    profile?: Profile;
}

const TandemProfileModal: React.FC<TandemProfileModalProps> = ({
    id,
    isVisible,
    learningLanguage,
    level,
    onClose,
    partnerLearningLanguage,
    pedagogy,
    profile,
}) => {
    if (!id || !learningLanguage || !profile || !level || !pedagogy || !partnerLearningLanguage) {
        return <div />;
    }

    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <TandemProfile
                id={id}
                learningLanguage={learningLanguage}
                level={level}
                onClose={onClose}
                partnerLearningLanguage={partnerLearningLanguage}
                pedagogy={pedagogy}
                partnerProfile={profile}
            />
        </Modal>
    );
};

export default TandemProfileModal;
