import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import { useStoreState } from '../../../store/storeTypes';
import CustomGoalShowContent from '../../components/contents/CustomGoalShowContent';

interface ShowCustomGoalPageProps {
    customLearningGoal: CustomLearningGoal;
    learningLanguageId: string;
}

const ShowCustomGoalPage = () => {
    const history = useHistory();
    const location = useLocation<ShowCustomGoalPageProps>();
    const { customLearningGoal, learningLanguageId } = location.state;
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/goals', { learningLanguageId: learningLanguageId });
    };

    const onUpdateCustomGoalPressed = (customLearningGoal: CustomLearningGoal) => {
        history.push('/update-custom-goal', { customLearningGoal });
    };

    const onShowAllGoalsPressed = (customLearningGoals?: CustomLearningGoal[]) => {
        history.push('/goals', { customLearningGoals, learningLanguageId });
    };

    return (
        <IonContent>
            <CustomGoalShowContent
                goBack={goBack}
                customLearningGoal={customLearningGoal}
                onUpdateCustomGoalPressed={onUpdateCustomGoalPressed}
                onShowAllGoalsPressed={onShowAllGoalsPressed}
            />
        </IonContent>
    );
};

export default ShowCustomGoalPage;
