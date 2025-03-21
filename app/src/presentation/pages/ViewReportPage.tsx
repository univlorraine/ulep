import { IonContent, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { ReportStatus } from '../../domain/entities/Report';
import { useStoreState } from '../../store/storeTypes';
import ViewReportContent from '../components/contents/ViewReportContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import Loader from '../components/Loader';
import ConfirmModal from '../components/modals/ConfirmModal';
import useGetReport from '../hooks/useGetReport';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

interface ViewReportPageProps {
    reportId: string;
}

const ViewReportPage: React.FC = () => {
    const { updateReportStatus } = useConfig();
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const location = useLocation<ViewReportPageProps>();
    const { reportId } = location.state;
    const [refreshReport, setRefreshReport] = useState<boolean>(false);
    const { report, error, isLoading } = useGetReport(reportId, refreshReport);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState<boolean>(false);
    const [showToast] = useIonToast();
    const { t } = useTranslation();

    const onCancelReport = async () => {
        const result = await updateReportStatus.execute(reportId, {
            status: ReportStatus.CANCELLED,
        });

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setIsCancelModalOpen(false);
        setRefreshReport(true);
    };

    const onCloseReport = async () => {
        const result = await updateReportStatus.execute(reportId, {
            status: ReportStatus.CLOSED,
        });

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setIsCloseModalOpen(false);
        setRefreshReport(true);
    };

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
                        <ViewReportContent
                            goBack={history.goBack}
                            report={report}
                            setIsCancelModalOpen={setIsCancelModalOpen}
                            setIsCloseModalOpen={setIsCloseModalOpen}
                        />
                        <ConfirmModal
                            isVisible={isCancelModalOpen}
                            onClose={() => setIsCancelModalOpen(false)}
                            title={t('report_item_page.cancel_modal.title')}
                            description={t('report_item_page.cancel_modal.text') as string}
                            onValidate={() => {
                                onCancelReport();
                            }}
                        />
                        <ConfirmModal
                            isVisible={isCloseModalOpen}
                            onClose={() => setIsCloseModalOpen(false)}
                            title={t('report_item_page.close_modal.title')}
                            description={t('report_item_page.close_modal.text') as string}
                            onValidate={() => {
                                onCloseReport();
                            }}
                        />
                    </>
                )}

                {isLoading && <Loader />}
            </IonContent>
        );
    }

    return (
        <OnlineWebLayout>
            {!isLoading && report && (
                <>
                    <ViewReportContent
                        goBack={history.goBack}
                        report={report}
                        setIsCancelModalOpen={setIsCancelModalOpen}
                        setIsCloseModalOpen={setIsCloseModalOpen}
                    />
                    <ConfirmModal
                        isVisible={isCancelModalOpen}
                        onClose={() => setIsCancelModalOpen(false)}
                        title={t('report_item_page.cancel_modal.title')}
                        description={t('report_item_page.cancel_modal.text') as string}
                        onValidate={() => {
                            onCancelReport();
                        }}
                    />
                    <ConfirmModal
                        isVisible={isCloseModalOpen}
                        onClose={() => setIsCloseModalOpen(false)}
                        title={t('report_item_page.close_modal.title')}
                        description={t('report_item_page.close_modal.text') as string}
                        onValidate={() => {
                            onCloseReport();
                        }}
                    />
                </>
            )}

            {isLoading && <Loader />}
        </OnlineWebLayout>
    );
};

export default ViewReportPage;
