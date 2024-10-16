import { IonContent, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import LearningContent from '../components/contents/LearningContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import ActivitiesContentModal from '../components/modals/ActivitiesContentModal';
import TandemProfileModal from '../components/modals/TandemProfileModal';
import TandemStatusModal from '../components/modals/TandemStatusModal';
import VocabularyContentModal from '../components/modals/VocabularyContentModal';
import useGetLearningData from '../hooks/useGetLearningData';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import GoalsContentModal from '../components/modals/GoalsContentModal';

const LearningPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();
    const [displayActivitiesContent, setDisplayActivitiesContent] = useState<boolean>(false);
    const [displayVocabularyContent, setDisplayVocabularyContent] = useState<boolean>(false);
    const [displayAllGoalsContent, setDisplayAllGoalsContent] = useState<boolean>(false);
    const profile = useStoreState((state) => state.profile);

    const { tandems, error, isLoading } = useGetLearningData();

    const onTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setSelectedTandem(tandem) : history.push('/tandem-status', { tandem });

    const onValidatedTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setSelectedTandem(tandem) : history.push('/tandem-profil', { tandem });

    const onVocabularyContentPressed = () =>
        !isHybrid ? setDisplayVocabularyContent(true) : history.push('/vocabularies');

    const onActivitiesContentPressed = () =>
        !isHybrid ? setDisplayActivitiesContent(true) : history.push('/activities');

    const onShowAllGoalsPressed = () =>
        !isHybrid ? setDisplayAllGoalsContent(true) : history.push('/goals');

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
                    onTandemPressed={onTandemPressed}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    onVocabularyListPressed={onVocabularyContentPressed}
                    onActivitiesContentPressed={onActivitiesContentPressed}
                    onShowAllGoalsPressed={onShowAllGoalsPressed}
                />
            </IonContent>
        );
    }

    return (
        <>
            <OnlineWebLayout profile={profile}>
                <LearningContent
                    isLoading={isLoading}
                    profile={profile}
                    tandems={tandems}
                    onTandemPressed={onTandemPressed}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    onVocabularyListPressed={onVocabularyContentPressed}
                    onActivitiesContentPressed={onActivitiesContentPressed}
                    onShowAllGoalsPressed={onShowAllGoalsPressed}
                />
            </OnlineWebLayout>
            <TandemStatusModal
                isVisible={
                    !!selectedTandem &&
                    (selectedTandem.status === 'DRAFT' ||
                        selectedTandem.status === 'INACTIVE' ||
                        selectedTandem.status === 'VALIDATED_BY_ONE_UNIVERSITY')
                }
                onClose={() => setSelectedTandem(undefined)}
                onFindNewTandem={() => history.push('pairing/languages')}
                status={selectedTandem?.status}
            />
            <TandemProfileModal
                isVisible={!!selectedTandem && selectedTandem.status === 'ACTIVE'}
                id={selectedTandem?.id}
                language={selectedTandem?.learningLanguage}
                level={selectedTandem?.level}
                onClose={() => setSelectedTandem(undefined)}
                partnerLearningLanguage={selectedTandem?.partnerLearningLanguage}
                pedagogy={selectedTandem?.pedagogy}
                profile={selectedTandem?.partner}
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
            <GoalsContentModal
                isVisible={displayAllGoalsContent}
                onClose={() => setDisplayAllGoalsContent(false)}
                profile={profile}
                learningLanguage={selectedTandem?.learningLanguage}
            />
        </>
    );
};

export default LearningPage;
