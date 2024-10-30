import { IonList, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Report from '../../../domain/entities/Report';
import styles from './ReportsList.module.css';
import ReportsListItem from './ReportsListItem';

interface ReportsListProps {
    reports: Report[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
    const { t } = useTranslation();

    return (
        <IonList lines="full" className={styles.container} aria-label={t('reports_page.list.aria_label') as string}>
            {reports.length > 0 ? (
                reports.map((report) => <ReportsListItem key={report.id} report={report} />)
            ) : (
                <IonText className={styles.no_reports}>{t('reports_page.no_reports')}</IonText>
            )}
        </IonList>
    );
};

export default ReportsList;
