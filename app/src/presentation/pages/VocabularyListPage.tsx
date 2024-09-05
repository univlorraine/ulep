import { IonContent, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { CreateVocabularyListCommand } from '../../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import { useStoreState } from '../../store/storeTypes';
import VocabularyListContent from '../components/contents/VocabularyListContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import AddVocabularyListModal from '../components/modals/AddVocabularyListModal';
import useGetVocabularyList from '../hooks/useGetVocabularyList';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const VocabularyListPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { createVocabularyList } = useConfig();
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [showAddVocabularyListModal, setShowAddVocabularyListModal] = useState(false);
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
                        onSelectVocabularyList={() => console.log('onSelectVocabularyList')}
                        profile={profile}
                        vocabularyLists={vocabularyLists}
                        isLoading={isLoading}
                    />
                </IonContent>
                <AddVocabularyListModal
                    isVisible={showAddVocabularyListModal}
                    onClose={() => setShowAddVocabularyListModal(false)}
                    onCreateVocabularyList={onCreateVocabularyList}
                    profile={profile}
                />
            </>
        );
    }

    return (
        <>
            <OnlineWebLayout profile={profile}>
                <VocabularyListContent
                    vocabularyLists={vocabularyLists}
                    onAddVocabularyList={() => console.log('onAddVocabularyList')}
                    onSelectVocabularyList={() => console.log('onSelectVocabularyList')}
                    profile={profile}
                    isLoading={isLoading}
                />
                <AddVocabularyListModal
                    isVisible={showAddVocabularyListModal}
                    onClose={() => setShowAddVocabularyListModal(false)}
                    onCreateVocabularyList={onCreateVocabularyList}
                    profile={profile}
                />
            </OnlineWebLayout>
        </>
    );
};

export default VocabularyListPage;
