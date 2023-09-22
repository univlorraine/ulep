import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AvailabilityModal.module.css';
import Modal from './Modal';

interface AvailabilityModalProps {
    currentAvailabilitiesOptions?: AvailabilitiesOptions;
    isVisible: boolean;
    onClose: () => void;
    onValidate: (occurence: AvailabilitiesOptions) => void;
    title: string;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
    currentAvailabilitiesOptions,
    isVisible,
    onClose,
    onValidate,
    title,
}) => {
    const { t } = useTranslation();
    const [occurrence, setAvailabilitiesOptions] = useState<AvailabilitiesOptions>(
        currentAvailabilitiesOptions ?? 'VERY_AVAILABLE'
    );

    useEffect(() => {
        setAvailabilitiesOptions(currentAvailabilitiesOptions ?? 'VERY_AVAILABLE');
    }, [isVisible]);

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div>
                <div className={styles.container}>
                    <span className={styles.title}>{title}</span>

                    <button
                        style={{ backgroundColor: occurrence === 'UNAVAILABLE' ? '#FDEE66' : '#F2F4F7' }}
                        className={styles['occurence-container']}
                        onClick={() => setAvailabilitiesOptions('UNAVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.UNAVAILABLE')}</p>
                    </button>

                    <button
                        style={{ backgroundColor: occurrence === 'AVAILABLE' ? '#FDEE66' : '#F2F4F7' }}
                        className={styles['occurence-container']}
                        onClick={() => setAvailabilitiesOptions('AVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.AVAILABLE')}</p>
                    </button>

                    <button
                        style={{ backgroundColor: occurrence === 'VERY_AVAILABLE' ? '#FDEE66' : '#F2F4F7' }}
                        className={styles['occurence-container']}
                        onClick={() => setAvailabilitiesOptions('VERY_AVAILABLE')}
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
