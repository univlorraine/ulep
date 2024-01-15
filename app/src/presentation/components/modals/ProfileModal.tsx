import { useState } from 'react';
import ProfileContent from '../contents/ProfileContent';
import SettingsContent from '../contents/SettingsContent';
import Modal from './Modal';
import Profile from '../../../domain/entities/Profile';

interface ProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    onDisconnect: () => void;
    profile: Profile;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
    isVisible,
    onClose,
    onDisconnect,
    profile
}) => {
    const [displaySettings, setDisplaySettings] = useState<boolean>(false);

    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            {!displaySettings ? (
                <ProfileContent
                    onClose={onClose}
                    onParameterPressed={() => setDisplaySettings(true)}
                    profile={profile}
                />
            ) : (
                <SettingsContent onBackPressed={() => setDisplaySettings(false)} onDisconnect={onDisconnect} />
            )}
        </Modal>
    );
};

export default ProfileModal;
