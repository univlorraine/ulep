import TandemStatusContent from '../contents/TandemStatusContent';
import Modal from './Modal';

interface TandemStatusModalProps {
    isVisible: boolean;
    onClose: () => void;
    status?: TandemStatus;
}

const TandemStatusModal: React.FC<TandemStatusModalProps> = ({ isVisible, onClose, status }) => {
    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <TandemStatusContent onClose={onClose} onFindNewTandem={() => null} status={status} />
        </Modal>
    );
};

export default TandemStatusModal;
