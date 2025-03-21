import { useTranslation } from 'react-i18next';
import styles from './ConfirmModal.module.css';
import Modal from './Modal';

interface ConfirmModalProps {
    isVisible: boolean;
    onClose: () => void;
    onValidate: () => void;
    title: string;
    description?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isVisible, onClose, onValidate, title, description }) => {
    const { t } = useTranslation();

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div>
                <div className={styles.container}>
                    <h2 className={styles.title}>{title}</h2>
                    {description && <p>{description}</p>}
                    <div className={styles['button-container']}>
                        <button
                            aria-label={t('confirm_modal.cancel') as string}
                            className="tertiary-button"
                            onClick={() => onClose()}
                        >
                            {t('confirm_modal.cancel')}
                        </button>
                        <button
                            aria-label={t('confirm_modal.validate') as string}
                            className={`primary-button margin-left`}
                            onClick={() => onValidate()}
                        >
                            {t('confirm_modal.validate')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
