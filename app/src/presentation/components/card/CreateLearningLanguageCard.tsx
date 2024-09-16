import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import styles from './CreateLearningLanguageCard.module.css';

interface CreateLearningLanguageCard {
    onPress: () => void;
}

const CreateLearningLanguageCard: React.FC<CreateLearningLanguageCard> = ({ onPress }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <p className={styles.title}>{t('create_learning_language.title')}</p>
            <IonButton className={`primary-button`} fill="clear" onClick={onPress}>
                {t('create_learning_language.button')}
            </IonButton>
        </div>
    );
};

export default CreateLearningLanguageCard;
