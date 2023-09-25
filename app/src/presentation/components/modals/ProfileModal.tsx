import { useState } from 'react';
import ProfileContent from '../contents/ProfileContent';
import SettingsContent from '../contents/SettingsContent';
import Modal from './Modal';
import { useStoreActions } from '../../../store/storeTypes';
import University from '../../../domain/entities/University';

interface ProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    onDisconnect: () => void;
    profileFirstname: string;
    profileLastname: string;
    profilePicture: string;
    profileUniversity: University;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
    isVisible,
    onClose,
    onDisconnect,
    profileFirstname,
    profileLastname,
    profilePicture,
    profileUniversity
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
                    profileUniversity={profileUniversity}
                />
            ) : (
                <SettingsContent onBackPressed={() => setDisplaySettings(false)} onDisconnect={onDisconnect} />
            )}
        </Modal>
    );
};

export default ProfileModal;
