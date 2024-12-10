import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { ArrowRightSvg } from '../../../assets';
import { Activity } from '../../../domain/entities/Activity';
import { codeLanguageToFlag } from '../../utils';
import styles from './ActivityCard.module.css';

interface ActivityCardProps {
    activity: Activity;
    onClick: (activity: Activity) => void;
    isHybrid: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick, isHybrid }) => {
    const { t } = useTranslation();

    return (
        <button className={styles.container} onClick={() => onClick(activity)}>
            <img className={styles.image} src={activity.imageUrl} alt={activity.title} />
            <div className={styles.content}>
                <p className={styles.title}>{activity.title}</p>
                <span className={styles.subtitle}>{activity.description}</span>
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
