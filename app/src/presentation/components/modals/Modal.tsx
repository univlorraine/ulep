import { ReactElement, useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    children: ReactElement;
    hideWhiteBackground?: boolean;
    isVisible: boolean;
    onClose: () => void;
    position?: 'center' | 'flex-end' | 'flex-start';
}

const Modal: React.FC<ModalProps> = ({ children, hideWhiteBackground, isVisible, onClose, position = 'center' }) => {
    const modalRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (isVisible && modalRef.current) {
            const modalElement = modalRef.current;
            //add any focusable HTML element you want to include to this string
            const focusableElements = modalElement.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            firstElement.focus();

            const handleTabKeyPress = (event: KeyboardEvent) => {
                if (event.key === 'Tab') {
                    if (event.shiftKey && document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    } else if (!event.shiftKey && document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            const handleEscapeKeyPress = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };

            modalElement.addEventListener('keydown', handleTabKeyPress);
            modalElement.addEventListener('keydown', handleEscapeKeyPress);

            return () => {
                modalElement.removeEventListener('keydown', handleTabKeyPress);
                modalElement.removeEventListener('keydown', handleEscapeKeyPress);
            };
        }
    }, [isVisible, onClose]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={styles.modal}
            style={{ justifyContent: position }}
            ref={modalRef}
            role="alertdialog"
            aria-modal="true"
        >
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
