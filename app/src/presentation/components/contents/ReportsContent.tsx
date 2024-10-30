import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { LeftChevronSvg } from '../../../assets';
import { useStoreState } from '../../../store/storeTypes';
import useGetReports from '../../hooks/useGetReports';
import Loader from '../Loader';
import ReportsList from '../reports/ReportsList';
import styles from './ReportsContent.module.css';
interface ReportsContentProps {
    goBack: () => void;
}

const ReportsContent: React.FC<ReportsContentProps> = ({ goBack }) => {
    const { t } = useTranslation();
    const refreshReport = useStoreState((state) => state.refreshReports);
    const { reports, error, isLoading } = useGetReports(refreshReport);
    const [showToast] = useIonToast();

    if (error) {
        showToast({ message: t('reports_page.error_get_reports'), duration: 5000 });
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <IonButton
                    fill="clear"
                    className={styles.back_button}
                    onClick={goBack}
                    aria-label={t('report_item_page.go_back') as string}
                >
                    <IonIcon icon={LeftChevronSvg} size="small" aria-hidden="true" />
                </IonButton>
                <h1 className={styles.title}>{t('reports_page.title')}</h1>
            </div>
            {!isLoading && <ReportsList reports={reports} />}
            {isLoading && <Loader />}
        </div>
    );
};

export default ReportsContent;
