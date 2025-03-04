import { IonButton, IonIcon } from '@ionic/react';
import { alertCircle, checkmarkCircle, closeCircle } from 'ionicons/icons';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightSvg } from '../../../assets';
import { Activity, ActivityStatus } from '../../../domain/entities/Activity';
import { useStoreState } from '../../../store/storeTypes';
import { codeLanguageToFlag } from '../../utils';
import styles from './ActivityCard.module.css';

interface ActivityCardProps {
    activity: Activity;
    onClick: (activity: Activity) => void;
    isHybrid: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick, isHybrid }) => {
    const { t } = useTranslation();
    const profile = useStoreState((state) => state.profile);
    const isMine = activity.creator?.id === profile?.id;

    return (
        <button className={styles.container} onClick={() => onClick(activity)}>
            <div className={styles.imageContainer}>
                <img className={styles.image} src={activity.imageUrl} alt={activity.title} />
                {isMine && activity.status === ActivityStatus.PUBLISHED && (
                    <IonIcon className={styles.status} icon={checkmarkCircle} color="success" aria-hidden="true" />
                )}
                {isMine && activity.status === ActivityStatus.IN_VALIDATION && (
                    <IonIcon className={styles.status} icon={alertCircle} color="warning" aria-hidden="true" />
                )}
                {isMine && activity.status === ActivityStatus.REJECTED && (
                    <IonIcon className={styles.status} icon={closeCircle} color="danger" aria-hidden="true" />
                )}
            </div>
            <div className={styles.content}>
                <p className={styles.title}>{activity.title}</p>
                <span className={styles.subtitle}>
                    {activity.description
                        .slice(0, 250)
                        .split('\n')
                        .map((line, index, array) => (
                            <Fragment key={index}>
                                {index === array.length - 1
                                    ? `${line}${activity.description.length >= 250 ? '...' : ''}`
                                    : line}
                                <br />
                            </Fragment>
                        ))}
                </span>
            </div>
            <div className={styles.information}>
                <div className={styles['information-container']}>
                    <span className={styles['information-title']}>{t('activity.list.language')}</span>
                    <span className={styles['information-content']}>
                        {codeLanguageToFlag(activity.language.code)} {t(`languages_code.${activity.language.code}`)}
                    </span>
                </div>

                <div className={styles['information-container']}>
                    <span className={styles['information-title']}>{t('activity.list.level')}</span>
                    <span className={styles['information-content']}>{activity.languageLevel}</span>
                </div>

                <div className={styles['information-container']}>
                    <span className={styles['information-title']}>{t('activity.list.theme')}</span>
                    <span className={styles['information-content']}>{activity.activityTheme.content}</span>
                </div>

                {!isHybrid && (
                    <IonButton fill="clear">
                        <IonIcon icon={ArrowRightSvg} />
                    </IonButton>
                )}
            </div>
        </button>
    );
};

export default ActivityCard;
