import { IonImg, IonItem } from '@ionic/react';
import { formatDate } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { MessagesPng, SignalerPng } from '../../../assets';
import Report from '../../../domain/entities/Report';
import { codeLanguageToFlag } from '../../utils';
import styles from './ReportsListItem.module.css';
import ReportStatusTag from './ReportStatusTag';

interface ReportsListItemProps {
    report: Report;
    key: string;
}

const ReportsListItem: React.FC<ReportsListItemProps> = ({ report, key }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const isConversationReport = report.category.name === 'Conversation';

    const getTandemInfo = () => {
        if (!report.metadata?.tandemUserName || !report.metadata?.tandemLanguage)
            return t('reports_page.list.tandem_missing');

        const tandemUserName = report.metadata.tandemUserName;
        const tandemLanguage = codeLanguageToFlag(report.metadata.tandemLanguage);

        return `${t('reports_page.list.tandem')} ${tandemUserName} ${tandemLanguage}`;
    };

    return (
        <IonItem
            key={key}
            className={styles.line}
            button={true}
            onClick={() => history.push(`/report-item`, { reportId: report.id })}
            aria-label={t('reports_page.item.aria_label', { name: report.content }) as string}
        >
            <IonImg
                aria-hidden
                className={styles.image}
                src={isConversationReport ? MessagesPng : SignalerPng}
                style={{ objectFit: 'contain' }}
            />
            <div className={styles.content}>
                <div className={styles.status_container}>
                    <ReportStatusTag status={report.status} />
                </div>
                <p className={styles.date}>
                    {t('reports_page.list.date')} {formatDate(report.createdAt, 'dd/MM/yy')} -{' '}
                    {isConversationReport ? getTandemInfo() : t('reports_page.list.application')}
                </p>
                <p className={styles.message}>
                    {isConversationReport ? report.category.name : t('reports_page.list.report_message')}
                </p>
            </div>
        </IonItem>
    );
};

export default ReportsListItem;
