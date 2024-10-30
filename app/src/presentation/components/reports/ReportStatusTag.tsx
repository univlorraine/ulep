import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReportStatus } from '../../../domain/entities/Report';
import styles from './ReportStatusTag.module.css';

interface ReportStatusTagProps {
    status: ReportStatus;
    isIcon?: boolean;
}

const ReportStatusTag: React.FC<ReportStatusTagProps> = ({ status, isIcon = false }) => {
    const { t } = useTranslation();

    const getStatus = (status: string) => {
        switch (status) {
            case 'OPEN':
                return {
                    text: t('reports_status.open'),
                    color: '#FF8700',
                };
            case 'CLOSED':
                return {
                    text: t('reports_status.close'),
                    color: '#000000',
                };
            default:
                return {
                    text: t('reports_status.canceled'),
                    color: '#F60C36',
                };
        }
    };
    const statusColor = getStatus(status).color;
    const statusText = getStatus(status).text;

    return (
        <div className={styles.container} style={{ borderColor: statusColor }}>
            <p className={styles.text}>{statusText}</p>
            {isIcon && <div className={styles.icon} style={{ backgroundColor: statusColor }}></div>}
        </div>
    );
};

export default ReportStatusTag;
