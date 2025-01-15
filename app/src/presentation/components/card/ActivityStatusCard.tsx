import { IonIcon } from '@ionic/react';
import { checkmarkOutline, closeOutline, ellipsisHorizontalOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { Activity, ActivityStatus } from '../../../domain/entities/Activity';
import styles from './ActivityStatusCard.module.css';

interface ActivityStatusProps {
    activity: Activity;
}

const ActivityStatusCard: React.FC<ActivityStatusProps> = ({ activity }) => {
    const { t } = useTranslation();
    const backgroundColor = () => {
        switch (activity.status) {
            case ActivityStatus.DRAFT:
                return '#FF8700';
            case ActivityStatus.IN_VALIDATION:
                return '#FF8700';
            case ActivityStatus.REJECTED:
                return '#F60C36';
            case ActivityStatus.PUBLISHED:
                return '#00FF47';
        }
    };
    const statusIcon = () => {
        switch (activity.status) {
            case ActivityStatus.DRAFT:
                return <IonIcon icon={ellipsisHorizontalOutline} />;
            case ActivityStatus.IN_VALIDATION:
                return <IonIcon icon={ellipsisHorizontalOutline} />;
            case ActivityStatus.REJECTED:
                return <IonIcon icon={closeOutline} />;
            case ActivityStatus.PUBLISHED:
                return <IonIcon icon={checkmarkOutline} />;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles['icon-container']} style={{ backgroundColor: backgroundColor() }}>
                {statusIcon()}
            </div>
            <p className={styles.content}>{t(`activity.status.${activity.status.toLowerCase()}`)}</p>
        </div>
    );
};

export default ActivityStatusCard;
