import Profile from '../../../domain/entities/Profile';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Modal from './Modal';
import GoalsContent from '../contents/GoalsContent';

interface GoalsContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
    learningLanguage: LearningLanguage;
}

const GoalsContentModal = ({ isVisible, onClose, profile, learningLanguage }: GoalsContentModalProps) => {
    return (
        <Modal
            isVisible={isVisible}
            onClose={onClose}
        >
            <GoalsContent profile={profile} learningLanguage={learningLanguage} />
        </Modal>
    )
}

export default GoalsContentModal;