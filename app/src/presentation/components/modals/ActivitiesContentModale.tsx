import { useState } from 'react';
import Profile from '../../../domain/entities/Profile';
import ActivitiesContent from '../contents/activity/ActivitiesContent';
import CreateActivityContent from '../contents/activity/CreateActivityContent';
import Modal from './Modal';

interface ActivitiesContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
}

const ActivitiesContentModal: React.FC<ActivitiesContentModalProps> = ({ isVisible, onClose, profile }) => {
    const [displayCreateActivity, setDisplayCreateActivity] = useState<boolean>(false);

    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            {!displayCreateActivity ? (
                <ActivitiesContent onAddActivity={() => setDisplayCreateActivity(true)} onBackPressed={onClose} />
            ) : (
                <CreateActivityContent onBackPressed={() => setDisplayCreateActivity(false)} profile={profile} />
            )}
        </Modal>
    );
};

export default ActivitiesContentModal;
