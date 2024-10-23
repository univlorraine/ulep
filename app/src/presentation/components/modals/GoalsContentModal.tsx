import Profile from '../../../domain/entities/Profile';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Modal from './Modal';
import GoalsContent from '../contents/GoalsContent';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import CustomGoalFormContent from '../contents/CustomGoalFormContent';
import CustomGoalShowContent from '../contents/CustomGoalShowContent';

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
        <Modal
            isVisible={isVisible}
            onClose={onClose}
            position="flex-end"
            hideWhiteBackground
        >
            <>
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
            </>
        </Modal>
    )
}

export default GoalsContentModal;
