import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Vocabulary from '../../../domain/entities/Vocabulary';
import { CreateVocabularyListCommand } from '../../../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import { useStoreState } from '../../../store/storeTypes';
import CreateOrUpdateVocabularyContent from '../../components/contents/CreateOrUpdateVocabularyContent';
import VocabularyContent from '../../components/contents/VocabularyContent';
import VocabularyListContent from '../../components/contents/VocabularyListContent';
import AddVocabularyListModal from '../../components/modals/AddVocabularyListModal';
import ShareVocabularyListModal from '../../components/modals/ShareVocabularyListModale';
import useVocabulary from '../../hooks/useVocabulary';

const VocabulariesPage = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const { getAllTandems } = useConfig();
    const [vocabularySelected, setVocabularySelected] = useState<Vocabulary>();
    const [showAddVocabularyListModal, setShowAddVocabularyListModal] = useState(false);
    const [showShareVocabularyListModal, setShowShareVocabularyListModal] = useState(false);
    const [profilesTandems, setProfilesTandems] = useState<Profile[]>([]);
    const [addContentMode, setAddContentMode] = useState(false);

    const {
        vocabularies,
        vocabularyLists,
        vocabularyListSelected,
        error,
        isLoading,
        onCreateVocabularyList,
        onShareVocabularyList,
        onUpdateVocabulary,
        onCreateVocabulary,
        onDeleteVocabulary,
        setVocabularyListSelected,
        setSearchVocabularies,
    } = useVocabulary();

    const handleCreateVocabularyList = async (vocabularyList: CreateVocabularyListCommand) => {
        await onCreateVocabularyList(vocabularyList);
        setShowAddVocabularyListModal(false);
    };

    const handleDeleteVocabulary = async (id: string) => {
        await onDeleteVocabulary(id);
        setAddContentMode(false);
    };

    const onAddOrUpdateVocabulary = (vocabulary?: Vocabulary) => {
        setVocabularySelected(vocabulary);
        setAddContentMode(true);
    };

    const handleCreateOrUpdateVocabulary = (
        word: string,
        translation: string,
        id?: string,
        wordPronunciation?: File,
        translationPronunciation?: File,
        deletePronunciationWord?: boolean,
        deletePronunciationTranslation?: boolean
    ) => {
        if (id) {
            onUpdateVocabulary(
                word,
                translation,
                id,
                wordPronunciation,
                translationPronunciation,
                deletePronunciationWord,
                deletePronunciationTranslation
            );
        } else {
            onCreateVocabulary(word, translation, wordPronunciation, translationPronunciation);
        }
        setAddContentMode(false);
    };

    const handleShareVocabularyList = async (profiles: Profile[]) => {
        await onShareVocabularyList(profiles);
        setShowShareVocabularyListModal(false);
    };

    const getProfilesTandems = async () => {
        if (!profile) {
            return [];
        }
        const tandems = await getAllTandems.execute(profile.id);

        if (tandems instanceof Error) {
            return [];
        }

        setProfilesTandems(tandems.filter((tandem) => tandem.partner).map((tandem) => tandem.partner) as Profile[]);
    };

    useEffect(() => {
        getProfilesTandems();
    }, [profile]);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/learning');
    };

    return (
        <IonContent>
            <>
                {!vocabularyListSelected && (
                    <VocabularyListContent
                        goBack={() => history.goBack()}
                        onAddVocabularyList={() => setShowAddVocabularyListModal(true)}
                        onSelectVocabularyList={(vocabularyList) => setVocabularyListSelected(vocabularyList)}
                        profile={profile}
                        vocabularyLists={vocabularyLists}
                        isLoading={isLoading}
                    />
                )}
                {vocabularyListSelected && !addContentMode && (
                    <VocabularyContent
                        profile={profile}
                        vocabularyList={vocabularyListSelected}
                        vocabularyPairs={vocabularies}
                        isLoading={isLoading}
                        goBack={() => setVocabularyListSelected(undefined)}
                        onAddVocabulary={onAddOrUpdateVocabulary}
                        onSearch={setSearchVocabularies}
                        onShareVocabularyList={() => setShowShareVocabularyListModal(true)}
                    />
                )}
                {vocabularyListSelected && addContentMode && (
                    <CreateOrUpdateVocabularyContent
                        vocabularyList={vocabularyListSelected}
                        vocabulary={vocabularySelected}
                        goBack={() => setAddContentMode(false)}
                        onSubmit={handleCreateOrUpdateVocabulary}
                        onDelete={handleDeleteVocabulary}
                    />
                )}
                <AddVocabularyListModal
                    isVisible={showAddVocabularyListModal}
                    onClose={() => setShowAddVocabularyListModal(false)}
                    onCreateVocabularyList={handleCreateVocabularyList}
                    profile={profile}
                />
                <ShareVocabularyListModal
                    isVisible={showShareVocabularyListModal}
                    onClose={() => setShowShareVocabularyListModal(false)}
                    onShareVocabularyList={handleShareVocabularyList}
                    tandemsProfiles={profilesTandems}
                    vocabularyList={vocabularyListSelected}
                />
            </>
        </IonContent>
    );
};

export default VocabulariesPage;
