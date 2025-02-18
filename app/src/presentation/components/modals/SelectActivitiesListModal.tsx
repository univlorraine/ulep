import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { Activity } from '../../../domain/entities/Activity';
import ActivityCard from '../card/ActivityCard';
import styles from './SelectActivitiesListModal.module.css';

interface SelectActivitiesListModalProps {
    isVisible: boolean;
    onClose: () => void;
    onValidate: (activity: Activity) => void;
    activities: Activity[];
    isHybrid?: boolean;
}

const SelectActivitiesListModal: React.FC<SelectActivitiesListModalProps> = ({
    isVisible,
    onClose,
    onValidate,
    activities,
    isHybrid,
}) => {
    const { t } = useTranslation();
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={`${styles.container} ${isHybrid && styles.mobileContainer}`}>
                <IonButton
                    aria-label={t('chat.activity_list.close') as string}
                    size="small"
                    fill="clear"
                    color="dark"
                    className={styles.close}
                    onClick={onClose}
                >
                    <IonIcon icon={closeCircle} slot="icon-only" className={styles.close_icon} />
                </IonButton>
                <p className={styles.title}>{t('chat.activity_list.title')}</p>

                <div className={styles.list}>
                    {activities.map((activity) => (
                        <ActivityCard
                            activity={activity}
                            onClick={() => onValidate(activity)}
                            isHybrid={Boolean(isHybrid)}
                        />
                    ))}
                </div>
            </div>
        </IonModal>
    );
};

export default SelectActivitiesListModal;
