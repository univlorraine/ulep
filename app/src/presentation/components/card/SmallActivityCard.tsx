import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { ArrowRightSvg } from '../../../assets';
import { Activity } from '../../../domain/entities/Activity';
import { codeLanguageToFlag } from '../../utils';
import styles from './SmallActivityCard.module.css';

interface SmallActivityCardProps {
    activity: Activity;
    onClick?: (activity: Activity) => void;
}

const SmallActivityCard: React.FC<SmallActivityCardProps> = ({ activity, onClick }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <span className={styles.header}>{t('activity.title')}</span>
            <div className={styles.content}>
                <p className={styles.title}>{activity.title}</p>
                <span className={styles.subtitle}>{activity.description}</span>
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

                    {onClick && (
                        <IonButton fill="clear" onClick={() => onClick(activity)}>
                            <IonIcon icon={ArrowRightSvg} />
                        </IonButton>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmallActivityCard;
