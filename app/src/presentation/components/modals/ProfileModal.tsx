import { useState } from 'react';
import ProfileContent from '../contents/ProfileContent';
import SettingsContent from '../contents/SettingsContent';
import Modal from './Modal';
import { useStoreActions } from '../../../store/storeTypes';

interface ProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    onDisconnect: () => void;
    profileFirstname: string;
    profileLastname: string;
    profilePicture: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
    isVisible,
    onClose,
    onDisconnect,
    profileFirstname,
    profileLastname,
    profilePicture,
}) => {
    const [displaySettings, setDisplaySettings] = useState<boolean>(false);

    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            {!displaySettings ? (
                <ProfileContent
                    onClose={onClose}
                    onParameterPressed={() => setDisplaySettings(true)}
                    profileFirstname={profileFirstname}
                    profileLastname={profileLastname}
                    profilePicture={profilePicture}
                />
            ) : (
                <SettingsContent onBackPressed={() => setDisplaySettings(false)} onDisconnect={onDisconnect} />
            )}
        </Modal>
    );
};

export default ProfileModal;
