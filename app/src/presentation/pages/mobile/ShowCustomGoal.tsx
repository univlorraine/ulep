import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useStoreState } from '../../../store/storeTypes';
import CustomGoalShowContent from '../../components/contents/CustomGoalShowContent';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';

interface ShowCustomGoalPageProps {
    customLearningGoal: CustomLearningGoal;
}

const ShowCustomGoalPage = () => {
    const history = useHistory();
    const location = useLocation<ShowCustomGoalPageProps>();
    const { customLearningGoal } = location.state;
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/goals');
    };

    const onUpdateCustomGoalPressed = (customLearningGoal: CustomLearningGoal) => {
        history.push('/update-custom-goal', { customLearningGoal });
    };

    const onShowAllGoalsPressed = (customLearningGoals?: CustomLearningGoal[]) => {
        history.push('/goals', { customLearningGoals });
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
