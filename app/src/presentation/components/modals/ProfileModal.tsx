import { useState } from 'react';
import Profile from '../../../domain/entities/Profile';
import ProfileContent from '../contents/ProfileContent';
import SettingsContent from '../contents/SettingsContent';
import Modal from './Modal';

interface ProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    onDisconnect: () => void;
    onLanguageChange?: () => void;
    profile: Profile;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isVisible, onClose, onDisconnect, onLanguageChange, profile }) => {
    const [displaySettings, setDisplaySettings] = useState<boolean>(false);

    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            {!displaySettings ? (
                <ProfileContent onParameterPressed={() => setDisplaySettings(true)} profile={profile} />
            ) : (
                <SettingsContent
                    onBackPressed={() => setDisplaySettings(false)}
                    onDisconnect={onDisconnect}
                    onLanguageChange={onLanguageChange}
                />
            )}
        </Modal>
    );
};

export default ProfileModal;
