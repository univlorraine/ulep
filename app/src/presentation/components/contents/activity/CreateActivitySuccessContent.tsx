import { IonButton, IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { StarPng } from '../../../../assets';
import { useConfig } from '../../../../context/ConfigurationContext';
import { Activity } from '../../../../domain/entities/Activity';
import SuccessLayout from '../../layout/SuccessLayout';
import styles from './CreateActivitySuccessContent.module.css';

interface CreateActivitySuccessContentProps {
    onNavigatePressed: (activityId: string) => void;
    onBackPressed: () => void;
    activity: Activity;
}
//TODO: Handle navigation to activity
const CreateActivitySuccessContent: React.FC<CreateActivitySuccessContentProps> = ({
    onNavigatePressed,
    onBackPressed,
    activity,
}) => {
    const { t } = useTranslation();
    const { configuration } = useConfig();

    return (
        <SuccessLayout
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            backgroundColorCode={configuration.primaryDarkColor}
            colorCode={configuration.primaryColor}
        >
            <div className={styles.container}>
                <h1 className="title">{t('activity.create.success_title')}</h1>
                <IonImg src={StarPng} className={styles.image} />
                <span className={styles.subtitle}>
                    {t('activity.create.success_description')}
                    <br />
                    {t('activity.create.success_description_2')}
                </span>
                <div className={styles['button-container']}>
                    <IonButton fill="clear" className="primary-button" onClick={() => onNavigatePressed(activity.id)}>
                        {t('activity.create.success_navigate_button')}
                    </IonButton>
                    <IonButton fill="clear" className="secondary-button" onClick={onBackPressed}>
                        {t('activity.create.success_close_button')}
                    </IonButton>
                </div>
            </div>
        </SuccessLayout>
    );
};

export default CreateActivitySuccessContent;
