import { useEffect, useState } from 'react';
import { useConfig } from '../../../context/ConfigurationContext';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import Vocabulary from '../../../domain/entities/Vocabulary';
import { CreateVocabularyListCommand } from '../../../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import { UpdateVocabularyListCommand } from '../../../domain/interfaces/vocabulary/UpdateVocabularyListUsecase.interface';
import useVocabulary from '../../hooks/useVocabulary';
import ErrorPage from '../../pages/ErrorPage';
import CreateOrUpdateVocabularyContent from '../contents/CreateOrUpdateVocabularyContent';
import FlipcardsContent from '../contents/FlipcardsContent';
import VocabularyItemContent from '../contents/VocabularyItemContent';
import VocabularyListContent from '../contents/VocabularyListContent';
import AddOrUpdateVocabularyListModal from '../modals/AddOrUpdateVocabularyListModal';
import SelectTandemModal from '../modals/SelectTandemModal';
import SelectVocabularyListsForQuizModale from '../modals/SelectVocabularyListsForQuizModal';

interface VocabularyContentProps {
    profile: Profile;
    onClose: () => void;
    isModal?: boolean;
    currentLearningLanguage: LearningLanguage;
}

const VocabularyContent: React.FC<VocabularyContentProps> = ({
    profile,
    onClose,
    isModal,
    currentLearningLanguage,
}) => {
    const { getAllTandems } = useConfig();
    const [vocabularySelected, setVocabularySelected] = useState<Vocabulary>();
    const [showAddVocabularyListModal, setShowAddVocabularyListModal] = useState(false);
    const [showShareVocabularyListModal, setShowShareVocabularyListModal] = useState(false);
    const [showSelectVocabularyListsForQuizModal, setShowSelectVocabularyListsForQuizModal] = useState(false);
    const [tandems, setTandems] = useState<Tandem[]>([]);
    const [addContentMode, setAddContentMode] = useState(false);
    const [quizzSelectedListIds, setQuizzSelectedListIds] = useState<string[]>([]);

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
    } = useVocabulary(currentLearningLanguage);

    const handleCreateVocabularyList = async (vocabularyList: CreateVocabularyListCommand) => {
        await onCreateVocabularyList(vocabularyList);
        setShowAddVocabularyListModal(false);
    };

    const handleUpdateVocabularyList = async (vocabularyList: UpdateVocabularyListCommand) => {
        if (vocabularyListSelected) {
            await onUpdateVocabularyList(vocabularyListSelected.id, vocabularyList);
        }
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

    const handleShareVocabularyList = async (tandems: Tandem[]) => {
        const tandemsWithProfile = tandems.filter((tandem) => tandem.partner !== undefined);
        await onShareVocabularyList(tandemsWithProfile.map((tandem) => tandem.partner) as Profile[]);
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

        setTandems(tandems);
    };

    const onSelectedVocabularyListsIdsForQuiz = (selectedListsIds: string[]) => {
        setShowSelectVocabularyListsForQuizModal(false);
        setQuizzSelectedListIds(selectedListsIds);
    };

    useEffect(() => {
        getProfilesTandems();
    }, [profile]);

    if (error) {
        return <ErrorPage />;
    }

    return (
        <>
            {!vocabularyListSelected && quizzSelectedListIds.length === 0 && (
                <VocabularyListContent
                    goBack={() => onClose()}
                    onAddVocabularyList={() => setShowAddVocabularyListModal(true)}
                    onSelectVocabularyList={(vocabularyList) => setVocabularyListSelected(vocabularyList)}
                    profile={profile}
                    vocabularyLists={vocabularyLists}
                    onStartQuiz={() => setShowSelectVocabularyListsForQuizModal(true)}
                    isLoading={isLoading}
                    isModal={isModal}
                />
            )}
            {vocabularyListSelected && !addContentMode && quizzSelectedListIds.length === 0 && (
                <VocabularyItemContent
                    profile={profile}
                    vocabularyList={vocabularyListSelected}
                    vocabularyPairs={vocabularies}
                    isLoading={isLoading}
                    goBack={() => setVocabularyListSelected(undefined)}
                    onAddVocabulary={onAddOrUpdateVocabulary}
                    onUpdateVocabularyList={() => setShowAddVocabularyListModal(true)}
                    onDeleteVocabularyList={onDeleteVocabularyList}
                    onSearch={setSearchVocabularies}
                    onShareVocabularyList={() => setShowShareVocabularyListModal(true)}
                    setQuizzSelectedListIds={setQuizzSelectedListIds}
                />
            )}
            {vocabularyListSelected && addContentMode && quizzSelectedListIds.length === 0 && (
                <CreateOrUpdateVocabularyContent
                    vocabularyList={vocabularyListSelected}
                    vocabulary={vocabularySelected}
                    goBack={() => setAddContentMode(false)}
                    onSubmit={handleCreateOrUpdateVocabulary}
                    onDelete={handleDeleteVocabulary}
                />
            )}
            {quizzSelectedListIds.length > 0 && (
                <FlipcardsContent
                    profile={profile}
                    selectedListsId={quizzSelectedListIds}
                    onBackPressed={() => setQuizzSelectedListIds([])}
                />
            )}
            <AddOrUpdateVocabularyListModal
                isVisible={showAddVocabularyListModal}
                vocabularyList={vocabularyListSelected}
                onClose={() => setShowAddVocabularyListModal(false)}
                onCreateVocabularyList={handleCreateVocabularyList}
                onUpdateVocabularyList={handleUpdateVocabularyList}
                currentLearningLanguage={currentLearningLanguage}
                profile={profile}
            />
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
                vocabularyLists={vocabularyLists}
                onValidate={onSelectedVocabularyListsIdsForQuiz}
                profile={profile}
            />
        </>
    );
};

export default VocabularyContent;
