import { ReactElement } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    children: ReactElement;
    isVisible: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isVisible, onClose }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.modal}>
            <div className={styles['modal-content']}>
                <button onClick={onClose} />
                {children}
            </div>
        </div>
    );
};

export default Modal;
