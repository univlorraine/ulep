/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
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
import SelectVocabularyListsForQuizModale from '../modals/SelectVocabularyListsForQuizModal';

interface VocabularyContentProps {
    profile: Profile;
    onClose: () => void;
    isModal?: boolean;
    currentLearningLanguage: LearningLanguage;
    currentVocabularyListId?: string;
}

const VocabularyContent: React.FC<VocabularyContentProps> = ({
    profile,
    onClose,
    isModal,
    currentLearningLanguage,
    currentVocabularyListId,
}) => {
    const [showToast] = useIonToast();
    const [vocabularySelected, setVocabularySelected] = useState<Vocabulary>();
    const [showAddVocabularyListModal, setShowAddVocabularyListModal] = useState(false);
    const [showSelectVocabularyListsForQuizModal, setShowSelectVocabularyListsForQuizModal] = useState(false);
    const [addContentMode, setAddContentMode] = useState(false);
    const [quizzSelectedListIds, setQuizzSelectedListIds] = useState<string[]>([]);
    const [initialSelectionDone, setInitialSelectionDone] = useState(false);

    const {
        vocabularies,
        vocabularyLists,
        vocabularyListSelected,
        associatedTandem,
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
        searchVocabularies,
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

    const handleShareVocabularyList = async () => {
        if (associatedTandem && associatedTandem.partner) {
            await onShareVocabularyList([profile, associatedTandem.partner]);
        } else {
            showToast('vocabulary.list.share.no_tandem');
        }
    };

    const handleUnshareVocabularyList = async () => {
        await onShareVocabularyList([profile]);
    };

    const onSelectedVocabularyListsIdsForQuiz = (selectedListsIds: string[]) => {
        setShowSelectVocabularyListsForQuizModal(false);
        setQuizzSelectedListIds(selectedListsIds);
    };

    useEffect(() => {
        if (!initialSelectionDone && currentVocabularyListId && vocabularyLists.length > 0) {
            const selectedList = vocabularyLists.find((list) => list.id === currentVocabularyListId);
            if (selectedList) {
                setVocabularyListSelected(selectedList);
                setInitialSelectionDone(true);
            }
        }
    }, [initialSelectionDone, currentVocabularyListId, vocabularyLists]);

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
                    searchVocabularies={searchVocabularies}
                    onSearch={setSearchVocabularies}
                    associatedTandem={associatedTandem}
                    onShareVocabularyList={handleShareVocabularyList}
                    onUnshareVocabularyList={handleUnshareVocabularyList}
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
                    learningLanguageId={currentLearningLanguage.id}
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
