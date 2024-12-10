import { IonButton, IonIcon, IonItem, IonLabel, IonList, useIonToast } from '@ionic/react';
import { downloadOutline, helpOutline, pencilOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightSvg } from '../../../../assets';
import { useConfig } from '../../../../context/ConfigurationContext';
import { Activity, ActivityStatus } from '../../../../domain/entities/Activity';
import Profile from '../../../../domain/entities/Profile';
import useGetActivity from '../../../hooks/useGetActivity';
import AudioLine from '../../AudioLine';
import ActivityStatusCard from '../../card/ActivityStatusCard';
import HeaderSubContent from '../../HeaderSubContent';
import Loader from '../../Loader';
import Modal from '../../modals/Modal';
import styles from './ActivityContent.module.css';

interface ActivityContentProps {
    activityId: string;
    onBackPressed: () => void;
    onUpdateActivityPressed: (activity: Activity) => void;
    profile: Profile;
}

export const ActivityContent: React.FC<ActivityContentProps> = ({
    activityId,
    onBackPressed,
    onUpdateActivityPressed,
    profile,
}) => {
    const { t } = useTranslation();
    const { browserAdapter, fileAdapter, updateActivityStatus } = useConfig();
    const [showToast] = useIonToast();
    const [refreshActivity, setRefreshActivity] = useState(false);
    const [isModalShareVisible, setIsModalShareVisible] = useState(false);
    const [isModalRejectedVisible, setIsModalRejectedVisible] = useState(false);
    const { activity, error, isLoading } = useGetActivity(activityId, refreshActivity);
    let name: string = '';

    if (profile.id === activity?.creator?.id) {
        name = t('activity.show.me');
    } else if (activity?.creator) {
        name = activity.creator.user.firstname;
    } else if (activity?.university) {
        name = activity?.university.name;
    }

    if (error) {
        showToast({
            message: error.message,
            duration: 2000,
        });
        onBackPressed();
    }

    if (!activity) {
        return <div />;
    }

    const handleDownload = async (e: React.MouseEvent<HTMLIonButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!activity.ressourceFileUrl) {
            return;
        }

        await fileAdapter.saveFile(activity.ressourceFileUrl, `${activity.title.trim().replace(/ /g, '_')}.pdf`);
        showToast({
            message: t('activity.show.ressource_file_downloaded'),
            duration: 2000,
        });
    };

    const onShareActivity = async () => {
        const result = await updateActivityStatus.execute(activity.id, ActivityStatus.IN_VALIDATION);

        if (result instanceof Error) {
            return showToast({
                message: result.message,
                duration: 2000,
            });
        }

        showToast({
            message: t('activity.show.activity_shared'),
            duration: 2000,
        });
        setRefreshActivity(!refreshActivity);
        return setIsModalShareVisible(false);
    };

    return (
        <div className={styles.container}>
            <HeaderSubContent
                title={t('activity.show.title')}
                onBackPressed={onBackPressed}
                kebabContent={(closeMenu) => (
                    <IonList lines="none">
                        {activity.status !== ActivityStatus.PUBLISHED && activity.creator?.id === profile.id && (
                            <IonItem
                                button={true}
                                detail={false}
                                onClick={() => {
                                    onUpdateActivityPressed(activity);
                                    closeMenu();
                                }}
                            >
                                <IonIcon icon={pencilOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>{t('activity.show.update')}</IonLabel>
                            </IonItem>
                        )}
                    </IonList>
                )}
            />
            {isLoading ? (
                <div className={styles.loader}>
                    <Loader />
                </div>
            ) : (
                <div className={styles.content}>
                    <img className={styles.image} src={activity.imageUrl} />
                    <div className={styles['primary-container']}>
                        <h1 className={styles['primary-title']}>{activity.title}</h1>
                        <p className={styles['primary-subtitle']}>
                            {activity.description.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </p>
                        <div className={styles['information-container']}>
                            <div>
                                <p className={styles['information-title']}>{t('activity.show.language')}</p>
                                <p className={styles['information-data']}>
                                    {t(`languages_code.${activity.language.code}`)}
                                </p>
                            </div>
                            <div>
                                <p className={styles['information-title']}>{t('activity.show.level')}</p>
                                <p className={styles['information-data']}>{activity.languageLevel}</p>
                            </div>
                            <div>
                                <p className={styles['information-title']}>{t('activity.show.theme')}</p>
                                <p className={styles['information-data']}>{activity.activityTheme.content}</p>
                            </div>
                        </div>
                        <div className={styles['creator-container']}>
                            <p className={styles['creator-prefix']}>
                                {t('activity.show.created_by')}
                                <span className={styles.creator}>{` ${name}`}</span>
                            </p>
                            {activity.status !== ActivityStatus.DRAFT && (
                                <div className={styles['status-container']}>
                                    <ActivityStatusCard activity={activity} />
                                    {activity.status === ActivityStatus.REJECTED && (
                                        <IonButton
                                            aria-label={t('activity.show.status_rejected') as string}
                                            fill="clear"
                                            className={styles['status-rejected']}
                                            onClick={() => setIsModalRejectedVisible(true)}
                                        >
                                            <IonIcon
                                                className={styles['status-rejected-icon']}
                                                icon={helpOutline}
                                                color="#FFF"
                                                size="small"
                                                aria-hidden
                                            />
                                        </IonButton>
                                    )}
                                </div>
                            )}
                        </div>
                        {activity.status === ActivityStatus.DRAFT && (
                            <IonButton
                                fill="clear"
                                className="primary-button no-padding"
                                onClick={() => setIsModalShareVisible(true)}
                            >
                                {t('activity.show.share')}
                            </IonButton>
                        )}

                        {activity.ressourceUrl && !activity.ressourceFileUrl && (
                            <div className={styles['ressource-line']}>
                                <div className={styles['ressource-container']}>
                                    {activity.ressourceOgUrl && (
                                        <img
                                            className={styles['ressource-image']}
                                            src={activity.ressourceOgUrl.ogImage?.[0].url}
                                        />
                                    )}
                                    <div className={styles['ressource-text']}>
                                        <a
                                            href={activity.ressourceUrl}
                                            onClick={browserAdapter.openLinkInBrowser}
                                            target="_blank"
                                        >
                                            {activity.ressourceOgUrl?.ogTitle
                                                ? activity.ressourceOgUrl?.ogTitle
                                                : activity.ressourceUrl}
                                        </a>
                                        <span>{activity.ressourceOgUrl?.ogSiteName}</span>
                                    </div>
                                    <IonIcon className={styles['ressource-icon']} icon={ArrowRightSvg} aria-hidden />
                                </div>
                            </div>
                        )}

                        {activity.ressourceFileUrl && (
                            <div className={styles['ressource-line']}>
                                <IonButton
                                    fill="clear"
                                    className={styles['ressource-download']}
                                    onClick={handleDownload}
                                >
                                    <IonIcon icon={downloadOutline} />
                                    {t('activity.show.ressource_file')}
                                </IonButton>
                            </div>
                        )}
                    </div>

                    <div className={styles['secondary-container']}>
                        <div className={styles['exercises-container']}>
                            {activity.exercises.map((exercise, index) => (
                                <div className={styles['exercise-container']} key={exercise.id}>
                                    <span className={styles['exercise-title']}>
                                        {t('activity.show.exercise', { index: index + 1 })}
                                    </span>
                                    <span className={styles.exercise}>{exercise.content}</span>
                                </div>
                            ))}
                        </div>

                        {activity.vocabularies.length > 0 && (
                            <div className={styles['vocabulary-container']}>
                                <p className={styles['vocabulary-title']}>{t('activity.show.vocabulary')}</p>

                                {activity.vocabularies.map((vocabulary, index) => (
                                    <div
                                        style={{ backgroundColor: index % 2 === 0 ? '#F2F4F7' : 'white' }}
                                        className={styles['vocabulary-item']}
                                        key={vocabulary.id}
                                    >
                                        <p className={styles.vocabulary}>{vocabulary.content}</p>
                                        {vocabulary.pronunciationUrl && (
                                            <div>
                                                <AudioLine
                                                    audioFile={vocabulary.pronunciationUrl}
                                                    hideProgressBar
                                                    small
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Modal isVisible={isModalRejectedVisible} onClose={() => setIsModalRejectedVisible(false)}>
                <div className={styles['modal-container']}>
                    <p className={styles['modal-title']}>{t('activity.show.modal_rejected_title')}</p>
                    <span className={styles['modal-description']}>
                        {t('activity.show.modal_rejected_description1')}
                    </span>
                    <br />
                    <span className={styles['modal-description']}>
                        {t('activity.show.modal_rejected_description2')}
                    </span>
                    <br />
                    <span className={styles['modal-description']}>
                        {t('activity.show.modal_rejected_description3')}
                    </span>

                    <IonButton fill="clear" className="primary-button" onClick={() => setIsModalRejectedVisible(false)}>
                        {t('activity.show.modal_rejected_close')}
                    </IonButton>
                </div>
            </Modal>
            <Modal isVisible={isModalShareVisible} onClose={() => setIsModalShareVisible(false)}>
                <div className={styles['modal-container']}>
                    <p className={styles['modal-title']}>{t('activity.show.modal_share_title')}</p>
                    <span className={styles['modal-description']}>{t('activity.show.modal_share_description1')}</span>
                    <br />
                    <span className={styles['modal-description']}>{t('activity.show.modal_share_description2')}</span>
                    <br />
                    <span className={styles['modal-description']}>{t('activity.show.modal_share_description3')}</span>

                    <IonButton fill="clear" className="primary-button" onClick={onShareActivity}>
                        {t('activity.show.modal_share_submit')}
                    </IonButton>
                    <IonButton fill="clear" className="secondary-button" onClick={() => setIsModalShareVisible(false)}>
                        {t('activity.show.modal_share_close')}
                    </IonButton>
                </div>
            </Modal>
        </div>
    );
};
