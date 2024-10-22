import { IonContent, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import VocabularyList from '../../domain/entities/VocabularyList';
import { CreateVocabularyListCommand } from '../../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import { useStoreState } from '../../store/storeTypes';
import VocabularyListContent from '../components/contents/VocabularyListContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import AddVocabularyListModal from '../components/modals/AddVocabularyListModal';
import useGetVocabularyList from '../hooks/useGetVocabularyList';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import SelectVocabularyListsForQuizModale from '../components/modals/SelectVocabularyListsForQuizModale';

const VocabularyListPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { createVocabularyList } = useConfig();
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [showAddVocabularyListModal, setShowAddVocabularyListModal] = useState(false);
    const [showSelectVocabularyListsForQuizModal, setShowSelectVocabularyListsForQuizModal] = useState(false);
    const [refreshVocabularyLists, setRefreshVocabularyLists] = useState(false);

    const { vocabularyLists, error, isLoading } = useGetVocabularyList(refreshVocabularyLists);

    const onCreateVocabularyList = async (vocabularyList: CreateVocabularyListCommand) => {
        const result = await createVocabularyList.execute(vocabularyList);
        if (result instanceof Error) {
            showToast({ message: t(result.message), duration: 5000 });
        }

        setRefreshVocabularyLists(!refreshVocabularyLists);
        setShowAddVocabularyListModal(false);
    };

    const onSelectVocabularyList = (vocabularyList: VocabularyList) => {
        history.push(`/vocabulary`, { vocabularyList });
    };

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <>
                <IonContent>
                    <VocabularyListContent
                        goBack={() => history.goBack()}
                        onAddVocabularyList={() => setShowAddVocabularyListModal(true)}
                        onSelectVocabularyList={onSelectVocabularyList}
                        profile={profile}
                        vocabularyLists={vocabularyLists}
                        isLoading={isLoading}
                        onStartQuiz={() => setShowSelectVocabularyListsForQuizModal(true)}
                    />
                </IonContent>
                <AddVocabularyListModal
                    isVisible={showAddVocabularyListModal}
                    onClose={() => setShowAddVocabularyListModal(false)}
                    onCreateVocabularyList={onCreateVocabularyList}
                    profile={profile}
                />
                <SelectVocabularyListsForQuizModale
                    isVisible={showSelectVocabularyListsForQuizModal}
                    onClose={() => setShowSelectVocabularyListsForQuizModal(false)}
                    vocabularyLists={vocabularyLists}
                    profile={profile}
                    isHybrid={isHybrid}
                />
            </>
        );
    }

    return (
        <>
            <OnlineWebLayout profile={profile}>
                <VocabularyListContent
                    vocabularyLists={vocabularyLists}
                    onAddVocabularyList={() => setShowAddVocabularyListModal(true)}
                    onSelectVocabularyList={onSelectVocabularyList}
                    profile={profile}
                    isLoading={isLoading}
                    onStartQuiz={() => setShowSelectVocabularyListsForQuizModal(true)}
                />
            </OnlineWebLayout>
            <AddVocabularyListModal
                isVisible={showAddVocabularyListModal}
                onClose={() => setShowAddVocabularyListModal(false)}
                onCreateVocabularyList={onCreateVocabularyList}
                profile={profile}
            />
            <SelectVocabularyListsForQuizModale
                isVisible={showSelectVocabularyListsForQuizModal}
                onClose={() => setShowSelectVocabularyListsForQuizModal(false)}
                vocabularyLists={vocabularyLists}
                profile={profile}
            />
        </>
    );
};

export default VocabularyListPage;
