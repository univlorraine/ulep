import { IonContent, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import ViewReportContent from '../components/contents/ViewReportContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import Loader from '../components/Loader';
import ConfirmCancelReportModal from '../components/modals/ConfirmCancelReportModal';
import useGetReport from '../hooks/useGetReport';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

interface ViewReportPageProps {
    reportId: string;
}

const ViewReportPage: React.FC = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const location = useLocation<ViewReportPageProps>();
    const { reportId } = location.state;
    const [refreshReport, setRefreshReport] = useState<boolean>(false);
    const { report, error, isLoading } = useGetReport(reportId, refreshReport);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showToast] = useIonToast();
    const { t } = useTranslation();

    if (error) {
        showToast({ message: t('report_item_page.error_update'), duration: 5000 });
    }

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <IonContent>
                {!isLoading && report && (
                    <>
                        <ViewReportContent goBack={history.goBack} report={report} setIsModalOpen={setIsModalOpen} />
                        <ConfirmCancelReportModal
                            isVisible={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            reportId={report.id}
                            setRefreshReport={setRefreshReport}
                        />
                    </>
                )}

                {isLoading && <Loader />}
            </IonContent>
        );
    }

    return (
        <OnlineWebLayout profile={profile}>
            {!isLoading && report && (
                <>
                    <ViewReportContent goBack={history.goBack} report={report} setIsModalOpen={setIsModalOpen} />
                    <ConfirmCancelReportModal
                        isVisible={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        reportId={report.id}
                        setRefreshReport={setRefreshReport}
                    />
                </>
            )}

            {isLoading && <Loader />}
        </OnlineWebLayout>
    );
};

export default ViewReportPage;
