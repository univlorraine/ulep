import { IonButton, IonIcon } from '@ionic/react';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import styles from './CustomGoalShowContent.module.css';
import { useTranslation } from 'react-i18next';
import { LeftChevronSvg } from '../../../assets';
import { useState } from 'react';
import { useConfig } from '../../../context/ConfigurationContext';
import ConfirmModal from '../modals/ConfirmModal';

interface CustomGoalShowContentProps {
    customLearningGoal: CustomLearningGoal;
    onUpdateCustomGoalPressed: (customLearningGoal: CustomLearningGoal) => void;
    onShowAllGoalsPressed: (customLearningGoals?: CustomLearningGoal[]) => void;
    goBack: () => void;
}

const CustomGoalShowContent = ({
    customLearningGoal,
    onUpdateCustomGoalPressed,
    goBack,
    onShowAllGoalsPressed,
}: CustomGoalShowContentProps) => {
    const { t } = useTranslation();
    const { deleteCustomLearningGoal } = useConfig();
    const [isDeleteCustomGoalModalVisible, setIsDeleteCustomGoalModalVisible] = useState(false);

    const onDeleteCustomGoalPressed = () => {
        setIsDeleteCustomGoalModalVisible(true);
    };

    const handleDeleteCustomGoal = async () => {
        const customLearningGoals = await deleteCustomLearningGoal.execute({ id: customLearningGoal.id });

        setIsDeleteCustomGoalModalVisible(false);

        if (customLearningGoals instanceof Error) {
            return;
        }

        onShowAllGoalsPressed(customLearningGoals);
    };

    return (
        <div className={`${styles.container} subcontent-container content-wrapper`}>
            <div className={styles.header}>
                {goBack && (
                    <IonButton
                        fill="clear"
                        onClick={goBack}
                        aria-label={t('goals.return_to_list_aria_label') as string}
                        className={styles.back_button}
                    >
                        <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                    </IonButton>
                )}
                <h2 className={styles.title}>{t('goals.show.title')}</h2>
            </div>
            <div className={styles.content}>
                <h3 className={styles.label}>{t('goals.show.title_label')}</h3>
                <p className={styles.show_title}>{customLearningGoal?.title}</p>
                <h3 className={styles.label}>{t('goals.show.description_label')}</h3>
                <p className={styles.show_description}>{customLearningGoal?.description}</p>
            </div>
            <div className={styles.buttons}>
                <IonButton
                    fill="clear"
                    className="primary-button no-padding"
                    onClick={() => onUpdateCustomGoalPressed(customLearningGoal)}
                >
                    {t('goals.show.update_button')}
                </IonButton>
                <IonButton
                    fill="clear"
                    className="secondary-button no-padding"
                    onClick={onDeleteCustomGoalPressed}
                >
                    {t('goals.show.delete_button')}
                </IonButton>
            </div>
            <ConfirmModal
                isVisible={isDeleteCustomGoalModalVisible}
                onClose={() => setIsDeleteCustomGoalModalVisible(false)}
                onValidate={handleDeleteCustomGoal}
                title={t('goals.confirm_delete')}
            />
        </div>
    )
}       

export default CustomGoalShowContent;
