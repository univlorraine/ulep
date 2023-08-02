import ProfileContent from '../contents/ProfileContent';
import Modal from './Modal';

interface ProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    profileFirstname: string;
    profileLastname: string;
    profilePicture: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
    isVisible,
    onClose,
    profileFirstname,
    profileLastname,
    profilePicture,
}) => {
    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            <ProfileContent
                onClose={onClose}
                onDisconnectPressed={function (): void {
                    throw new Error('Function not implemented.');
                }}
                onEditPressed={function (): void {
                    throw new Error('Function not implemented.');
                }}
                onParameterPressed={function (): void {
                    throw new Error('Function not implemented.');
                }}
                profileFirstname={profileFirstname}
                profileLastname={profileLastname}
                profilePicture={profilePicture}
            />
        </Modal>
    );
};

export default ProfileModal;
