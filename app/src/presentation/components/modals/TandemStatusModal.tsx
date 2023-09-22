import TandemStatusContent from '../contents/TandemStatusContent';
import Modal from './Modal';

interface TandemStatusModalProps {
    isVisible: boolean;
    onClose: () => void;
    onFindNewTandem: () => void;
    status?: TandemStatus;
}

const TandemStatusModal: React.FC<TandemStatusModalProps> = ({ isVisible, onClose, onFindNewTandem, status }) => {
    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <TandemStatusContent onClose={onClose} onFindNewTandem={onFindNewTandem} status={status} />
        </Modal>
    );
};

export default TandemStatusModal;
