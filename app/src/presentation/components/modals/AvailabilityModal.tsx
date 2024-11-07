import { IonButton } from '@ionic/react';
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
                    <span className={styles.title} id="dialog_label">
                        {title}
                    </span>

                    <IonButton
                        aria-label={t('signup_availabilities_page.UNAVAILABLE') as string}
                        fill="clear"
                        className={`${styles['occurence-container']} ${
                            occurrence === 'UNAVAILABLE' ? styles.selected : ''
                        }`}
                        onClick={() => setAvailabilitiesOptions('UNAVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.UNAVAILABLE')}</p>
                    </IonButton>

                    <IonButton
                        aria-label={t('signup_availabilities_page.AVAILABLE') as string}
                        fill="clear"
                        className={`${styles['occurence-container']} ${
                            occurrence === 'AVAILABLE' ? styles.selected : ''
                        }`}
                        onClick={() => setAvailabilitiesOptions('AVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.AVAILABLE')}</p>
                    </IonButton>

                    <IonButton
                        aria-label={t('signup_availabilities_page.VERY_AVAILABLE') as string}
                        fill="clear"
                        className={`${styles['occurence-container']} ${
                            occurrence === 'VERY_AVAILABLE' ? styles.selected : ''
                        }`}
                        onClick={() => setAvailabilitiesOptions('VERY_AVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.VERY_AVAILABLE')}</p>
                    </IonButton>

                    <IonButton
                        aria-label={t('signup_availabilities_page.modal.validate_button') as string}
                        className="primary-button margin-top no-padding"
                        fill="clear"
                        onClick={() => onValidate(occurrence)}
                    >
                        {t('signup_availabilities_page.modal.validate_button')}
                    </IonButton>
                </div>
            </div>
        </Modal>
    );
};

export default AvailabilityModal;
