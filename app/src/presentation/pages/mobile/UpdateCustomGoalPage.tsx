import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useStoreState } from '../../../store/storeTypes';
import CustomGoalFormContent from '../../components/contents/CustomGoalFormContent';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';

interface UpdateCustomGoalPageProps {
    learningLanguageId: string;
    customLearningGoal: CustomLearningGoal;
}

const UpdateCustomGoalPage = () => {
    const history = useHistory();
    const location = useLocation<UpdateCustomGoalPageProps>();
    const { learningLanguageId, customLearningGoal } = location.state;
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/show-custom-goal', { customLearningGoal });
    };

    const onShowAllGoalsPressed = (customLearningGoals: CustomLearningGoal[]) => {
        history.push('/goals', { customLearningGoals });
    };

    return (
        <IonContent>
            <CustomGoalFormContent
                goBack={goBack}
                learningLanguageId={learningLanguageId}
                customLearningGoal={customLearningGoal}
                onShowAllGoalsPressed={onShowAllGoalsPressed}
            />
        </IonContent>
    );
};

export default UpdateCustomGoalPage;
