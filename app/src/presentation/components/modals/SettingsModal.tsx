import SettingsContent from '../contents/SettingsContent';
import Modal from './Modal';

interface SettingsModalProps {
    isVisible: boolean;
    onClose: () => void;
    onDisconnect: () => void;
    onLanguageChange?: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose, onDisconnect, onLanguageChange }) => {
    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            <SettingsContent
                onBackPressed={() => onClose()}
                onDisconnect={onDisconnect}
                onLanguageChange={onLanguageChange}
            />
        </Modal>
    );
};

export default SettingsModal;
