import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useStoreState } from '../../../store/storeTypes';
import GoalsContent from '../../components/contents/GoalsContent';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';

const GoalsListPage = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const learningLanguage = useStoreState((state) => state.currentTandem?.learningLanguage);
    const location = useLocation<{ customLearningGoals: CustomLearningGoal[] }>();
    const customLearningGoals = location.state?.customLearningGoals;

    if (!profile || !learningLanguage) {
        return <Redirect to="/learning" />;
    }

    const goBack = () => {
        history.push('/learning');
    };

    const onAddCustomGoalPressed = () => {
        history.push('create-custom-goal', { learningLanguageId: learningLanguage?.id });
    };

    const onShowCustomGoalPressed = (customLearningGoal: CustomLearningGoal) => {
        history.push('show-custom-goal', { customLearningGoal });
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
