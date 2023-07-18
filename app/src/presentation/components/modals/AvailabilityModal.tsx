import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { occurence } from '../../../domain/entities/Availability';
import Checkbox from '../Checkbox';
import TextInput from '../TextInput';
import styles from './AvailabilityModal.module.css';
import Modal from './Modal';

interface AvailabilityModalProps {
    currentOccurence?: occurence;
    isVisible: boolean;
    onClose: () => void;
    onValidate: (occurence: occurence, note?: string, isPrivate?: boolean) => void;
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
    const [isNoteMode, setNoteMode] = useState<boolean>(false);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [note, setNote] = useState<string>('');
    const [occurrence, setOccurence] = useState<occurence>(currentOccurence ?? 'VERY_AVAILABLE');

    useEffect(() => {
        setIsPrivate(false);
        setNoteMode(false);
        setNote('');
        setOccurence(currentOccurence ?? 'VERY_AVAILABLE');
    }, [isVisible]);
    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div>
                {isNoteMode && (
                    <div className={styles.container}>
                        <span className={styles.title}>{t('signup_availabilities_page.modal.title_note')}</span>
                        <TextInput
                            customHeight={170}
                            onChange={setNote}
                            title={t('signup_availabilities_page.modal.note')}
                            type="text-area"
                            value={note}
                        />
                        <div className={styles['checkbox-container']}>
                            <Checkbox
                                isSelected={isPrivate}
                                onPressed={() => setIsPrivate(!isPrivate)}
                                name={t('signup_availabilities_page.modal.private_text')}
                            />
                        </div>
                        <div className={styles['button-container']}>
                            <button className="tertiary-button" onClick={onClose}>
                                {t('signup_availabilities_page.modal.pass_button')}
                            </button>
                            <button
                                className="primary-button margin-left"
                                onClick={() => onValidate(occurrence, note, isPrivate)}
                            >
                                {t('signup_availabilities_page.modal.validate_button')}
                            </button>
                        </div>
                    </div>
                )}

                {!isNoteMode && (
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

                        <button className="primary-button margin-top" onClick={() => setNoteMode(true)}>
                            {t('signup_availabilities_page.modal.validate_button')}
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AvailabilityModal;
