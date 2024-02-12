import { ReactElement, useEffect } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    children: ReactElement;
    hideWhiteBackground?: boolean;
    isVisible: boolean;
    onClose: () => void;
    position?: 'center' | 'flex-end' | 'flex-start';
}

const Modal: React.FC<ModalProps> = ({ children, hideWhiteBackground, isVisible, onClose, position = 'center' }) => {
    const handleClickOutside = (event: MouseEvent) => {
        const modalContent = document.getElementById('modal-content');

        if (modalContent && !modalContent.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.modal} style={{ justifyContent: position }}>
            {!hideWhiteBackground && (
                <div id="modal-content" className={styles['modal-content']}>
                    {children}
                </div>
            )}
            {hideWhiteBackground && children}
        </div>
    );
};

export default Modal;
