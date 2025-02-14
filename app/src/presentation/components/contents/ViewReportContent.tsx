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
    setIsModalOpen: (isModalOpen: boolean) => void;
}

const ViewReportContent: React.FC<ViewReportContentProps> = ({ goBack, report, setIsModalOpen }) => {
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
                    <IonButton
                        className={`tertiary-button no-padding ${styles.cancel_button}`}
                        fill="clear"
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                        aria-label={t('report_item_page.button_cancel') as string}
                    >
                        {t('report_item_page.button_cancel')}
                    </IonButton>
                )}
            </div>
        </div>
    );
};

export default ViewReportContent;
