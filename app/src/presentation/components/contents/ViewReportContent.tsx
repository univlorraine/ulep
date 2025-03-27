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

import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { LeftChevronSvg } from '../../../assets';
import { MessageType } from '../../../domain/entities/chat/Message';
import MessageReport from '../../../domain/entities/MessageReport';
import Report, { ReportCategoryName, ReportStatus } from '../../../domain/entities/Report';
import MediaComponent from '../chat/MediaComponent';
import ReportDetail from '../reports/ReportDetail';
import ReportStatusTag from '../reports/ReportStatusTag';
import styles from './ViewReportContent.module.css';

interface ViewReportContentProps {
    goBack: () => void;
    report: Report;
    setIsCancelModalOpen: (isModalOpen: boolean) => void;
    setIsCloseModalOpen: (isModalOpen: boolean) => void;
}

const ViewReportContent: React.FC<ViewReportContentProps> = ({
    goBack,
    report,
    setIsCancelModalOpen,
    setIsCloseModalOpen,
}) => {
    const { t } = useTranslation();

    const isConversationReport = report.category.name === ReportCategoryName.CONVERSATION;
    const isMediaReport =
        report.metadata?.mediaType &&
        report.metadata?.mediaType !== MessageType.Text &&
        report.metadata?.mediaType !== MessageType.Link;
    const isReportCancelled = report.status === ReportStatus.CANCELLED;
    const isReportClosed = report.status === ReportStatus.CLOSED;

    const messageMedia = new MessageReport(
        report.id,
        report.metadata?.filePath,
        report.metadata?.mediaType as MessageType,
        report.metadata
    );

    const messageContent =
        isConversationReport && report.content.includes('----')
            ? report.content.split('----')[1]?.trim()
            : report.content;

    const createdDate = new Date(report.createdAt).toLocaleDateString();

    return (
        <div className={`${styles.container}`}>
            <div className={styles.header}>
                <IonButton fill="clear" onClick={goBack} aria-label={t('report_item_page.go_back') as string}>
                    <IonIcon icon={LeftChevronSvg} size="small" aria-hidden="true" />
                </IonButton>
                <h1 className={styles.title}>{t('report_item_page.title')}</h1>
            </div>
            <div className={styles.content_container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        {isConversationReport
                            ? t('report_item_page.conversation.title')
                            : `${t('report_item_page.application.title')} :  ${report.category.name}`}
                    </h1>
                    <div className={styles.status_container}>
                        <ReportStatusTag status={report.status} isIcon={true} />
                    </div>
                    <div className={styles.details_container}>
                        {isConversationReport ? (
                            isMediaReport ? (
                                <div className={styles.item}>
                                    <p className={styles.item_title}>
                                        {`${t('report_item_page.conversation.message')} ${createdDate} - ${report.metadata.tandemUserName}`}
                                    </p>
                                    <div className={styles.item_content_media}>
                                        <MediaComponent message={messageMedia} setImageToDisplay={() => {}} />
                                    </div>
                                </div>
                            ) : (
                                <ReportDetail
                                    title={`${t('report_item_page.conversation.message')} ${createdDate} - ${report.metadata.tandemUserName}`}
                                    text={messageContent}
                                    isUrl={messageMedia.metadata?.mediaType === MessageType.Link}
                                />
                            )
                        ) : (
                            <>
                                <ReportDetail title={t('report_item_page.application.date')} text={createdDate} />
                                <ReportDetail
                                    title={t('report_item_page.application.details')}
                                    text={messageContent}
                                    isTextStrong={true}
                                />
                            </>
                        )}
                        <ReportDetail
                            title={t('report_item_page.comment')}
                            text={report.comment || t('report_item_page.no_comment')}
                        />
                    </div>
                </div>
                {!isReportCancelled && !isReportClosed && (
                    <div className={styles.button_container}>
                        <IonButton
                            className={`tertiary-button no-padding ${styles.cancel_button}`}
                            fill="clear"
                            onClick={() => {
                                setIsCancelModalOpen(true);
                            }}
                            aria-label={t('report_item_page.button_cancel') as string}
                        >
                            {t('report_item_page.button_cancel')}
                        </IonButton>
                        <IonButton
                            className={`primary-button no-padding`}
                            fill="clear"
                            onClick={() => {
                                setIsCloseModalOpen(true);
                            }}
                            aria-label={t('report_item_page.button_close') as string}
                        >
                            {t('report_item_page.button_close')}
                        </IonButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewReportContent;
