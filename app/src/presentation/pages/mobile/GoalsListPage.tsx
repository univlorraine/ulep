import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import { useStoreState } from '../../../store/storeTypes';
import GoalsContent from '../../components/contents/GoalsContent';

const GoalsListPage = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const location = useLocation<{ customLearningGoals: CustomLearningGoal[]; learningLanguageId: string }>();
    const { customLearningGoals, learningLanguageId } = location.state;

    const learningLanguage = useStoreState((state) =>
        state.profile?.learningLanguages.find((learningLanguage) => learningLanguage.id === learningLanguageId)
    );

    if (!profile || !learningLanguage) {
        return <Redirect to="/learning" />;
    }

    const goBack = () => {
        history.push('/learning');
    };

    const onAddCustomGoalPressed = () => {
        history.push('create-custom-goal', { learningLanguageId });
    };

    const onShowCustomGoalPressed = (customLearningGoal: CustomLearningGoal) => {
        history.push('show-custom-goal', { customLearningGoal, learningLanguageId });
    };

    return (
        <IonContent>
            <GoalsContent
                goBack={goBack}
                profile={profile}
                learningLanguage={learningLanguage}
                customLearningGoals={customLearningGoals}
                onAddCustomGoalPressed={onAddCustomGoalPressed}
                onShowCustomGoalPressed={onShowCustomGoalPressed}
            />
        </IonContent>
    );
};

export default GoalsListPage;
