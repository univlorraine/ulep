import ReportContent from '../contents/ReportContent';
import Modal from './Modal';

interface ReportModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isVisible, onClose }) => {
    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <ReportContent onClose={onClose} />
        </Modal>
    );
};

export default ReportModal;
