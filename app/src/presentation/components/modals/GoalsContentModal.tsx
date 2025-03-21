import { IonModal } from '@ionic/react';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import CustomGoalFormContent from '../contents/CustomGoalFormContent';
import CustomGoalShowContent from '../contents/CustomGoalShowContent';
import GoalsContent from '../contents/GoalsContent';
import styles from './ActivitiesContentModal.module.css';

export const DisplayCustomGoalModalEnum = {
    list: 'list',
    form: 'form',
    show: 'show',
};

export interface DisplayCustomGoalModal {
    type: (typeof DisplayCustomGoalModalEnum)[keyof typeof DisplayCustomGoalModalEnum];
    customLearningGoal?: CustomLearningGoal;
}

interface GoalsContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
    learningLanguage?: LearningLanguage;
    displayCustomGoalModal?: DisplayCustomGoalModal;
    onAddCustomGoalPressed: () => void;
    onShowAllGoalsPressed: () => void;
    onShowCustomGoalPressed: (customLearningGoal: CustomLearningGoal) => void;
    onUpdateCustomGoalPressed: (customLearningGoal: CustomLearningGoal) => void;
}

const GoalsContentModal = ({
    isVisible,
    onClose,
    profile,
    learningLanguage,
    displayCustomGoalModal,
    onAddCustomGoalPressed,
    onUpdateCustomGoalPressed,
    onShowAllGoalsPressed,
    onShowCustomGoalPressed,
}: GoalsContentModalProps) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.content}>
                {displayCustomGoalModal?.type === DisplayCustomGoalModalEnum.list && (
                    <GoalsContent
                        profile={profile}
                        goBack={onClose}
                        learningLanguage={learningLanguage}
                        onAddCustomGoalPressed={onAddCustomGoalPressed}
                        onShowCustomGoalPressed={onShowCustomGoalPressed}
                    />
                )}
                {displayCustomGoalModal?.type === DisplayCustomGoalModalEnum.form && learningLanguage?.id && (
                    <CustomGoalFormContent
                        customLearningGoal={displayCustomGoalModal.customLearningGoal}
                        learningLanguageId={learningLanguage.id}
                        goBack={onShowAllGoalsPressed}
                        onShowAllGoalsPressed={onShowAllGoalsPressed}
                    />
                )}
                {displayCustomGoalModal?.type === DisplayCustomGoalModalEnum.show &&
                    displayCustomGoalModal.customLearningGoal && (
                        <CustomGoalShowContent
                            customLearningGoal={displayCustomGoalModal.customLearningGoal}
                            goBack={onShowAllGoalsPressed}
                            onUpdateCustomGoalPressed={onUpdateCustomGoalPressed}
                            onShowAllGoalsPressed={onShowAllGoalsPressed}
                        />
                    )}
            </div>
        </IonModal>
    );
};

export default GoalsContentModal;
