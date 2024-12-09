import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import Vocabulary from '../../../domain/entities/Vocabulary';
import { CreateVocabularyListCommand } from '../../../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import { UpdateVocabularyListCommand } from '../../../domain/interfaces/vocabulary/UpdateVocabularyListUsecase.interface';
import { useStoreState } from '../../../store/storeTypes';
import CreateOrUpdateVocabularyContent from '../../components/contents/CreateOrUpdateVocabularyContent';
import VocabularyItemContent from '../../components/contents/VocabularyItemContent';
import VocabularyListContent from '../../components/contents/VocabularyListContent';
import AddOrUpdateVocabularyListModal from '../../components/modals/AddOrUpdateVocabularyListModal';
import SelectTandemModal from '../../components/modals/SelectTandemModal';
import SelectVocabularyListsForQuizModale from '../../components/modals/SelectVocabularyListsForQuizModal';
import useVocabulary from '../../hooks/useVocabulary';

interface VocabulariesPageProps {
    tandem?: Tandem;
}

const VocabulariesPage: React.FC<VocabulariesPageProps> = () => {
    const history = useHistory();
    const location = useLocation<VocabulariesPageProps>();
    const { tandem } = location.state;
    const profile = useStoreState((state) => state.profile);
    const { getAllTandems } = useConfig();
    const [vocabularySelected, setVocabularySelected] = useState<Vocabulary>();
    const [showAddVocabularyListModal, setShowAddVocabularyListModal] = useState(false);
    const [showShareVocabularyListModal, setShowShareVocabularyListModal] = useState(false);
    const [showSelectVocabularyListsForQuizModal, setShowSelectVocabularyListsForQuizModal] = useState(false);
    const [tandems, setTandems] = useState<Tandem[]>([]);
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
        onUpdateVocabularyList,
        onDeleteVocabulary,
        onDeleteVocabularyList,
        setVocabularyListSelected,
        setSearchVocabularies,
    } = useVocabulary(tandem?.learningLanguage);

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
        translation?: string,
        id?: string,
        wordPronunciation?: File,
        translationPronunciation?: File,
        deletePronunciationWord?: boolean,
        deletePronunciationTranslation?: boolean
    ) => {
        if (id) {
            onUpdateVocabulary(
                id,
                word,
                translation,
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

    const handleShareVocabularyList = async (tandems: Tandem[]) => {
        const tandemsWithProfile = tandems.filter((tandem) => tandem.partner !== undefined);
        await onShareVocabularyList(tandemsWithProfile.map((tandem) => tandem.partner) as Profile[]);
        setShowShareVocabularyListModal(false);
    };

    const handleUpdateVocabularyList = async (vocabularyList: UpdateVocabularyListCommand) => {
        if (vocabularyListSelected) {
            await onUpdateVocabularyList(vocabularyListSelected.id, vocabularyList);
        }
        setShowAddVocabularyListModal(false);
    };

    const onSelectedVocabularyListsIdsForQuiz = (selectedListsId: string[]) => {
        history.push('/flipcards', { selectedListsId });
    };

    const getProfilesTandems = async () => {
        if (!profile) {
            return [];
        }
        const tandems = await getAllTandems.execute(profile.id);

        if (tandems instanceof Error) {
            return [];
        }

        setTandems(tandems);
    };

    useEffect(() => {
        getProfilesTandems();
    }, [profile]);

    if (!profile) {
        return <Redirect to="/" />;
    }

    if (error) {
        return <Redirect to="/learning" />;
    }

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
                        onStartQuiz={() => setShowSelectVocabularyListsForQuizModal(true)}
                    />
                )}
                {vocabularyListSelected && !addContentMode && (
                    <VocabularyItemContent
                        profile={profile}
                        vocabularyList={vocabularyListSelected}
                        vocabularyPairs={vocabularies}
                        isLoading={isLoading}
                        goBack={() => setVocabularyListSelected(undefined)}
                        onAddVocabulary={onAddOrUpdateVocabulary}
                        onUpdateVocabularyList={onAddOrUpdateVocabulary}
                        onDeleteVocabularyList={onDeleteVocabularyList}
                        onSearch={setSearchVocabularies}
                        onShareVocabularyList={() => setShowShareVocabularyListModal(true)}
                        setQuizzSelectedListIds={onSelectedVocabularyListsIdsForQuiz}
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
                {location.state?.tandem && (
                    <AddOrUpdateVocabularyListModal
                        isVisible={showAddVocabularyListModal}
                        onClose={() => setShowAddVocabularyListModal(false)}
                        onCreateVocabularyList={handleCreateVocabularyList}
                        onUpdateVocabularyList={handleUpdateVocabularyList}
                        profile={profile}
                        currentLearningLanguage={location.state.tandem.learningLanguage}
                    />
                )}
                <SelectTandemModal
                    isVisible={showShareVocabularyListModal}
                    onClose={() => setShowShareVocabularyListModal(false)}
                    onSelectTandem={handleShareVocabularyList}
                    selectedProfilesIds={vocabularyListSelected?.editorsIds}
                    tandems={tandems}
                    title="vocabulary.list.share.title"
                    multiple
                />
                <SelectVocabularyListsForQuizModale
                    isVisible={showSelectVocabularyListsForQuizModal}
                    onClose={() => setShowSelectVocabularyListsForQuizModal(false)}
                    onValidate={onSelectedVocabularyListsIdsForQuiz}
                    vocabularyLists={vocabularyLists}
                    profile={profile}
                />
            </>
        </IonContent>
    );
};

export default VocabulariesPage;
