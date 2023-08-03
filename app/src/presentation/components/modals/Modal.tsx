import { ReactElement } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    children: ReactElement;
    hideWhiteBackground?: boolean;
    isVisible: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, hideWhiteBackground, isVisible, onClose }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.modal}>
            {!hideWhiteBackground && <div className={styles['modal-content']}>{children}</div>}
            {hideWhiteBackground && children}
        </div>
    );
};

export default Modal;
