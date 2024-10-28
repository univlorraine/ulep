import { IonButton, IonIcon, IonModal, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { CloseWhiteSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { ReportStatus } from '../../../domain/entities/Report';

import styles from './SelectTandemModal.module.css';

interface ConfirmCancelReportModalProps {
    isVisible: boolean;
    onClose: () => void;
    reportId: string;
    setRefreshReport: (refreshReport: boolean) => void;
}

const ConfirmCancelReportModal: React.FC<ConfirmCancelReportModalProps> = ({
    isVisible,
    onClose,
    reportId,
    setRefreshReport,
}) => {
    const { t } = useTranslation();
    const { updateReportStatus } = useConfig();
    const [showToast] = useIonToast();

    const onCancelReport = async () => {
        const result = await updateReportStatus.execute(reportId, {
            status: ReportStatus.CANCELLED,
        });

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        onClose();
        setRefreshReport(true);
    };

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose}>
            <div className={styles.container}>
                <div className={styles.close} onClick={onClose} aria-hidden={true}>
                    <IonIcon icon={CloseWhiteSvg} />
                </div>
                <h2 className={styles.title}>{t('report_item_page.cancel_modal.title')}</h2>
                <p className={styles.text}>{t('report_item_page.cancel_modal.text')}</p>
                <div className={styles.buttons}>
                    <IonButton
                        fill="clear"
                        className="primary-button no-padding"
                        onClick={() => onCancelReport()}
                        aria-label={t('report_item_page.cancel_modal.validate_button') as string}
                    >
                        {t('report_item_page.cancel_modal.validate_button')}
                    </IonButton>
                    <IonButton
                        fill="clear"
                        className="secondary-button no-padding"
                        onClick={onClose}
                        aria-label={t('report_item_page.cancel_modal.cancel_button') as string}
                    >
                        {t('report_item_page.cancel_modal.cancel_button')}
                    </IonButton>
                </div>
            </div>
        </IonModal>
    );
};

export default ConfirmCancelReportModal;
