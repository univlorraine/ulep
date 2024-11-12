import { IonContent, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import CustomLearningGoal from '../../domain/entities/CustomLearningGoal';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import LearningContent from '../components/contents/LearningContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import ActivitiesContentModal from '../components/modals/ActivitiesContentModal';
import GoalsContentModal, {
    DisplayCustomGoalModal,
    DisplayCustomGoalModalEnum,
} from '../components/modals/GoalsContentModal';
import TandemProfileModal from '../components/modals/TandemProfileModal';
import TandemStatusModal from '../components/modals/TandemStatusModal';
import VocabularyContentModal from '../components/modals/VocabularyContentModal';
import useGetLearningData from '../hooks/useGetLearningData';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const LearningPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const [refresh, setRefresh] = useState<boolean>(false);
    const [currentTandem, setCurrentTandem] = useState<Tandem>();
    const [displaySelectedTandem, setDisplaySelectedTandem] = useState<Tandem>();
    const [displayActivitiesContent, setDisplayActivitiesContent] = useState<boolean>(false);
    const [displayVocabularyContent, setDisplayVocabularyContent] = useState<boolean>(false);
    const [displayCustomGoalModal, setDisplayCustomGoalModal] = useState<DisplayCustomGoalModal>();
    const profile = useStoreState((state) => state.profile);
    const { tandems, error, isLoading } = useGetLearningData(refresh);

    useEffect(() => {
        if (tandems.length > 0) {
            const refreshedCurrentTandem = currentTandem && tandems.find((tandem) => tandem.id === currentTandem.id);
            const tandem = refreshedCurrentTandem ?? tandems[0];
            setCurrentTandem(tandem);
        }
    }, [tandems, currentTandem]);

    const onTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setDisplaySelectedTandem(tandem) : history.push('/tandem-status', { tandem });

    const onValidatedTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setDisplaySelectedTandem(tandem) : history.push('/tandem-profil', { tandem });

    const onVocabularyContentPressed = () =>
        !isHybrid ? setDisplayVocabularyContent(true) : history.push('/vocabularies');

    const onActivitiesContentPressed = () =>
        !isHybrid ? setDisplayActivitiesContent(true) : history.push('/activities');

    const onShowAllGoalsPressed = (customLearningGoals?: CustomLearningGoal[]) => {
        setRefresh(!refresh);
        !isHybrid
            ? setDisplayCustomGoalModal({ type: DisplayCustomGoalModalEnum.list })
            : history.push('/goals', { customLearningGoals });
    };

    const onAddCustomGoalPressed = () => {
        setDisplayCustomGoalModal({
            type: DisplayCustomGoalModalEnum.form,
        });
    };

    const onShowCustomGoalPressed = (customLearningGoal: CustomLearningGoal) => {
        setRefresh(!refresh);
        setDisplayCustomGoalModal({ type: DisplayCustomGoalModalEnum.show, customLearningGoal });
    };

    const onUpdateCustomGoalPressed = (customLearningGoal: CustomLearningGoal) => {
        setDisplayCustomGoalModal({ type: DisplayCustomGoalModalEnum.form, customLearningGoal });
    };

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <IonContent>
                <LearningContent
                    isLoading={isLoading}
                    profile={profile}
                    tandems={tandems}
                    currentTandem={currentTandem}
                    onTandemPressed={onTandemPressed}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    onVocabularyListPressed={onVocabularyContentPressed}
                    onActivitiesContentPressed={onActivitiesContentPressed}
                    onShowAllGoalsPressed={onShowAllGoalsPressed}
                    setCurrentTandem={setCurrentTandem}
                />
            </IonContent>
        );
    }

    return (
        <>
            <OnlineWebLayout>
                <LearningContent
                    isLoading={isLoading}
                    profile={profile}
                    tandems={tandems}
                    currentTandem={currentTandem}
                    onTandemPressed={onTandemPressed}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    onVocabularyListPressed={onVocabularyContentPressed}
                    onActivitiesContentPressed={onActivitiesContentPressed}
                    onShowAllGoalsPressed={onShowAllGoalsPressed}
                    setCurrentTandem={setCurrentTandem}
                />
            </OnlineWebLayout>
            <TandemStatusModal
                isVisible={
                    !!displaySelectedTandem &&
                    (displaySelectedTandem.status === 'DRAFT' ||
                        displaySelectedTandem.status === 'INACTIVE' ||
                        displaySelectedTandem.status === 'VALIDATED_BY_ONE_UNIVERSITY')
                }
                onClose={() => setDisplaySelectedTandem(undefined)}
                onFindNewTandem={() => history.push('pairing/languages')}
                status={displaySelectedTandem?.status}
            />
            <TandemProfileModal
                isVisible={!!displaySelectedTandem && displaySelectedTandem.status === 'ACTIVE'}
                id={displaySelectedTandem?.id}
                language={displaySelectedTandem?.learningLanguage}
                level={displaySelectedTandem?.level}
                onClose={() => setDisplaySelectedTandem(undefined)}
                partnerLearningLanguage={displaySelectedTandem?.partnerLearningLanguage}
                pedagogy={displaySelectedTandem?.pedagogy}
                profile={displaySelectedTandem?.partner}
            />
            <ActivitiesContentModal
                isVisible={displayActivitiesContent}
                onClose={() => setDisplayActivitiesContent(false)}
                profile={profile}
            />
            <VocabularyContentModal
                isVisible={displayVocabularyContent}
                onClose={() => setDisplayVocabularyContent(false)}
                profile={profile}
            />
            {tandems.length > 0 && (
                <GoalsContentModal
                    isVisible={Boolean(displayCustomGoalModal)}
                    onClose={() => setDisplayCustomGoalModal(undefined)}
                    displayCustomGoalModal={displayCustomGoalModal}
                    profile={profile}
                    learningLanguage={currentTandem?.learningLanguage || tandems[0].learningLanguage}
                    onAddCustomGoalPressed={onAddCustomGoalPressed}
                    onShowCustomGoalPressed={onShowCustomGoalPressed}
                    onUpdateCustomGoalPressed={onUpdateCustomGoalPressed}
                    onShowAllGoalsPressed={onShowAllGoalsPressed}
                />
            )}
        </>
    );
};

export default LearningPage;
