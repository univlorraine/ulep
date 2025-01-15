import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import { useStoreState } from '../../../store/storeTypes';
import CustomGoalFormContent from '../../components/contents/CustomGoalFormContent';

interface CreateSessionPageProps {
    learningLanguageId: string;
}

const CreateCustomGoalPage = () => {
    const history = useHistory();
    const location = useLocation<CreateSessionPageProps>();
    const { learningLanguageId } = location.state;
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/learning" />;
    }

    const goBack = () => {
        history.push('/goals', { learningLanguageId });
    };

    const onShowAllGoalsPressed = (customLearningGoals: CustomLearningGoal[]) => {
        history.push('/goals', { customLearningGoals, learningLanguageId });
    };

    return (
        <IonContent>
            <CustomGoalFormContent
                goBack={goBack}
                learningLanguageId={learningLanguageId}
                onShowAllGoalsPressed={onShowAllGoalsPressed}
            />
        </IonContent>
    );
};

export default CreateCustomGoalPage;
