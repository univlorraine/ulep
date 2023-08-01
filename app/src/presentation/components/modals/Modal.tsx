import { ReactElement } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    children: ReactElement;
    hideWhiteBackground: boolean;
    isVisible: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, hideWhiteBackground, isVisible, onClose }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.modal}>
            <div className={!hideWhiteBackground ? styles['modal-content'] : ''}>{children}</div>
        </div>
    );
};

export default Modal;
