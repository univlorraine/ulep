import { ReactElement } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    children: ReactElement;
    hideWhiteBackground?: boolean;
    isVisible: boolean;
    onClose: () => void;
    position?: 'center' | 'flex-end' | 'flex-start';
}

const Modal: React.FC<ModalProps> = ({ children, hideWhiteBackground, isVisible, onClose, position = 'center' }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.modal} style={{ justifyContent: position }}>
            {!hideWhiteBackground && <div className={styles['modal-content']}>{children}</div>}
            {hideWhiteBackground && children}
        </div>
    );
};

export default Modal;
