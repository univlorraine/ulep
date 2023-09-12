import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { occurence } from '../../../domain/entities/Availability';
import styles from './AvailabilityModal.module.css';
import Modal from './Modal';

interface AvailabilityModalProps {
    currentOccurence?: occurence;
    isVisible: boolean;
    onClose: () => void;
    onValidate: (occurence: occurence) => void;
    title: string;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
    currentOccurence,
    isVisible,
    onClose,
    onValidate,
    title,
}) => {
    const { t } = useTranslation();
    const [occurrence, setOccurence] = useState<occurence>(currentOccurence ?? 'VERY_AVAILABLE');

    useEffect(() => {
        setOccurence(currentOccurence ?? 'VERY_AVAILABLE');
    }, [isVisible]);
    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div>
                <div className={styles.container}>
                    <span className={styles.title}>{title}</span>

                    <button
                        style={{ backgroundColor: occurrence === 'UNAVAILABLE' ? '#FDEE66' : '#F2F4F7' }}
                        className={styles['occurence-container']}
                        onClick={() => setOccurence('UNAVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.UNAVAILABLE')}</p>
                    </button>

                    <button
                        style={{ backgroundColor: occurrence === 'AVAILABLE' ? '#FDEE66' : '#F2F4F7' }}
                        className={styles['occurence-container']}
                        onClick={() => setOccurence('AVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.AVAILABLE')}</p>
                    </button>

                    <button
                        style={{ backgroundColor: occurrence === 'VERY_AVAILABLE' ? '#FDEE66' : '#F2F4F7' }}
                        className={styles['occurence-container']}
                        onClick={() => setOccurence('VERY_AVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.VERY_AVAILABLE')}</p>
                    </button>

                    <button className="primary-button margin-top" onClick={() => onValidate(occurrence)}>
                        {t('signup_availabilities_page.modal.validate_button')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AvailabilityModal;
