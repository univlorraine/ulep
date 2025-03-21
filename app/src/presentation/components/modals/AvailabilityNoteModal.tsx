import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Checkbox from '../Checkbox';
import TextInput from '../TextInput';
import styles from './AvailabilityModal.module.css';
import Modal from './Modal';

interface AvailabilityNoteModalProps {
    isVisible: boolean;
    onClose: () => void;
    onValidate: (note?: string, isPrivate?: boolean) => void;
    defaultIsPrivate?: boolean;
    defaultNote?: string;
}

const AvailabilityNoteModal: React.FC<AvailabilityNoteModalProps> = ({
    defaultIsPrivate = false,
    defaultNote = '',
    isVisible,
    onClose,
    onValidate,
}) => {
    const { t } = useTranslation();
    const [isPrivate, setIsPrivate] = useState<boolean>(defaultIsPrivate);
    const [note, setNote] = useState<string>(defaultNote);

    useEffect(() => {
        setIsPrivate(defaultIsPrivate);
        setNote(defaultNote);
    }, [isVisible]);
    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div>
                <div className={styles.container}>
                    <span className={styles.title}>{t('signup_availabilities_page.modal.title_note')}</span>
                    <TextInput
                        id="input-note"
                        customHeight={170}
                        onChange={setNote}
                        title={t('signup_availabilities_page.modal.note') as string}
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
                        <button
                            aria-label={t('signup_availabilities_page.modal.pass_button') as string}
                            className="tertiary-button"
                            onClick={() => onValidate()}
                        >
                            {t('signup_availabilities_page.modal.pass_button')}
                        </button>
                        <button
                            aria-label={t('signup_availabilities_page.modal.validate_button') as string}
                            className={`primary-button margin-left ${note.trim().length === 0 ? 'disabled' : ''}`}
                            disabled={note.trim().length === 0}
                            onClick={() => onValidate(note, isPrivate)}
                        >
                            {t('signup_availabilities_page.modal.validate_button')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AvailabilityNoteModal;
