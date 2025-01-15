import { IonIcon, IonModal } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CloseWhiteSvg } from '../../../assets/index';
import styles from './CreditModal.module.css';

interface CreditModalProps {
    isVisible: boolean;
    onClose: () => void;
    credit: string;
}

const CreditModal: React.FC<CreditModalProps> = ({ isVisible, onClose, credit }) => {
    const { t } = useTranslation();

    return (
        <IonModal isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.close} onClick={onClose} aria-hidden={true}>
                    <IonIcon icon={CloseWhiteSvg} />
                </div>
                <h1 className={styles.title}>{t('credit.title')}</h1>
                <span className={styles.credit}>{credit}</span>
            </div>
        </IonModal>
    );
};

export default CreditModal;
