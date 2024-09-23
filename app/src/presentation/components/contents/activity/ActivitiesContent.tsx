import { IonButton, IonIcon, IonImg } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { AddSvg } from '../../../../assets';

interface ActivitiesContentProps {
    onAddActivity: () => void;
    onBackPressed: () => void;
}

export const ActivitiesContent = ({ onBackPressed, onAddActivity }: ActivitiesContentProps) => {
    //TODO: Get filters
    //TODO: Get activities
    const { t } = useTranslation();
    return (
        <div className="subcontent-container content-wrapper">
            <div className="subcontent-header">
                <IonButton fill="clear" onClick={onBackPressed}>
                    <IonIcon icon={arrowBackOutline} color="dark" />
                </IonButton>
                <p className="subcontent-title">{t('activity.list.title')}</p>
                <div />
            </div>
            <IonButton fill="clear" className="add-button" onClick={() => onAddActivity()}>
                <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
            </IonButton>
        </div>
    );
};

export default ActivitiesContent;
