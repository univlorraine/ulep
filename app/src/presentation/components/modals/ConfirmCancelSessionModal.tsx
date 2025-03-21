import { IonButton, IonIcon } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseWhiteSvg } from '../../../assets';
import TextInput from '../TextInput';
import Modal from './Modal';
import styles from './SelectTandemModal.module.css';

interface ConfirmCancelSessionModalProps {
    isVisible: boolean;
    onClose: () => void;
    onCancelSession: (comment: string) => void;
}

const ConfirmCancelSessionModal: React.FC<ConfirmCancelSessionModalProps> = ({
    isVisible,
    onClose,
    onCancelSession,
}) => {
    const { t } = useTranslation();
    const [comment, setComment] = useState('');

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div className={styles.container}>
                <div className={styles.close} onClick={onClose} aria-hidden={true}>
                    <IonIcon icon={CloseWhiteSvg} />
                </div>
                <h2 className={styles.title}>{t('session.confirm_cancel.title')}</h2>
                <div className={styles.content}>
                    <p>{t('session.confirm_cancel.content')}</p>
                    <TextInput
                        id="input-comment"
                        type="text-area"
                        title={t('session.confirm_cancel.comment_label') as string}
                        value={comment}
                        onChange={(text) => setComment(text)}
                    />
                </div>
                <div className={styles.buttons}>
                    <IonButton fill="clear" className="primary-button" onClick={() => onCancelSession(comment)}>
                        {t('session.confirm_cancel.confirm_btn')}
                    </IonButton>
                    <IonButton fill="clear" className="secondary-button" onClick={onClose}>
                        {t('session.confirm_cancel.cancel_btn')}
                    </IonButton>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmCancelSessionModal;
