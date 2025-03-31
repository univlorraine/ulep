/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
