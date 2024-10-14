import { useEffect, useState } from 'react';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Vocabulary from '../../../domain/entities/Vocabulary';
import { CreateVocabularyListCommand } from '../../../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import useVocabulary from '../../hooks/useVocabulary';
import CreateOrUpdateVocabularyContent from '../contents/CreateOrUpdateVocabularyContent';
import VocabularyContent from '../contents/VocabularyContent';
import VocabularyListContent from '../contents/VocabularyListContent';
import AddVocabularyListModal from './AddVocabularyListModal';
import Modal from './Modal';
import ShareVocabularyListModal from './ShareVocabularyListModale';

interface VocabularyContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
}

const VocabularyContentModal: React.FC<VocabularyContentModalProps> = ({ isVisible, onClose, profile }) => {
    const { getAllTandems } = useConfig();
    const [vocabularySelected, setVocabularySelected] = useState<Vocabulary>();
    const [showAddVocabularyListModal, setShowAddVocabularyListModal] = useState(false);
    const [showShareVocabularyListModal, setShowShareVocabularyListModal] = useState(false);
    const [profilesTandems, setProfilesTandems] = useState<Profile[]>([]);
    const [addContentMode, setAddContentMode] = useState(false);

    //TODO: Handle error
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

    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            <>
                {!vocabularyListSelected && (
                    <VocabularyListContent
                        goBack={() => onClose()}
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
        </Modal>
    );
};

export default VocabularyContentModal;
