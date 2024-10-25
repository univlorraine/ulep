import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import Profile from '../../domain/entities/Profile';
import Vocabulary from '../../domain/entities/Vocabulary';
import VocabularyList from '../../domain/entities/VocabularyList';
import { CreateVocabularyListCommand } from '../../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import { useStoreState } from '../../store/storeTypes';

const useVocabulary = () => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const {
        getVocabularyLists,
        getVocabularies,
        createVocabularyList,
        updateVocabularyList,
        updateVocabulary,
        createVocabulary,
        deleteVocabulary,
    } = useConfig();
    const [refreshVocabularyLists, setRefreshVocabularyLists] = useState<boolean>(false);
    const [refreshVocabularies, setRefreshVocabularies] = useState<boolean>(false);
    const [vocabularyListSelected, setVocabularyListSelected] = useState<VocabularyList | undefined>(undefined);
    const [searchVocabularies, setSearchVocabularies] = useState<string>('');
    const profile = useStoreState((state) => state.profile);

    const [vocabularyResult, setVocabularyResult] = useState<{
        vocabularies: Vocabulary[];
        vocabularyLists: VocabularyList[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        vocabularies: [],
        vocabularyLists: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile)
        return {
            ...vocabularyResult,
            vocabularyListSelected,
            setSearchVocabularies,
            setVocabularyListSelected,
            onShareVocabularyList: () => {},
            onUpdateVocabulary: () => {},
            onCreateVocabulary: () => {},
            onCreateVocabularyList: () => {},
            onDeleteVocabulary: () => {},
        };

    const onCreateVocabularyList = async (vocabularyList: CreateVocabularyListCommand) => {
        const result = await createVocabularyList.execute(vocabularyList);
        if (result instanceof Error) {
            showToast({ message: t(result.message), duration: 5000 });
        }

        setRefreshVocabularyLists(!refreshVocabularyLists);
    };

    const onShareVocabularyList = async (profiles: Profile[]) => {
        if (!vocabularyListSelected) {
            return;
        }
        const result = await updateVocabularyList.execute(vocabularyListSelected.id, {
            profileIds: profiles.map((profile) => profile.id),
        });

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setRefreshVocabularyLists(!refreshVocabularyLists);
    };

    const onUpdateVocabulary = async (
        word: string,
        translation: string,
        id: string,
        wordPronunciation?: File,
        translationPronunciation?: File,
        deletePronunciationWord?: boolean,
        deletePronunciationTranslation?: boolean
    ) => {
        const result = await updateVocabulary.execute(id, {
            word,
            translation,
            wordPronunciation,
            translationPronunciation,
            deletePronunciationWord,
            deletePronunciationTranslation,
        });

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setRefreshVocabularies(!refreshVocabularies);
    };

    const onCreateVocabulary = async (
        word: string,
        translation: string,
        wordPronunciation?: File,
        translationPronunciation?: File
    ) => {
        if (!vocabularyListSelected) {
            return;
        }
        const result = await createVocabulary.execute({
            word,
            translation,
            vocabularyListId: vocabularyListSelected.id,
            wordPronunciation,
            translationPronunciation,
        });

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setRefreshVocabularies(!refreshVocabularies);
    };

    const onDeleteVocabulary = async (id: string) => {
        const result = await deleteVocabulary.execute(id);

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setRefreshVocabularies(!refreshVocabularies);
    };

    useEffect(() => {
        const fetchData = async () => {
            setVocabularyResult({
                ...vocabularyResult,
                isLoading: true,
            });
            const vocabularyListsResult = await getVocabularyLists.execute(profile.id);

            if (vocabularyListsResult instanceof Error) {
                return setVocabularyResult({
                    ...vocabularyResult,
                    vocabularyLists: [],
                    error: vocabularyListsResult,
                    isLoading: false,
                });
            }

            setVocabularyResult({
                ...vocabularyResult,
                vocabularyLists: vocabularyListsResult,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [profile, refreshVocabularyLists, vocabularyListSelected]);

    useEffect(() => {
        const fetchData = async () => {
            if (!vocabularyListSelected) {
                return;
            }
            setVocabularyResult({
                ...vocabularyResult,
                isLoading: true,
            });
            const result = await getVocabularies.execute(vocabularyListSelected.id, searchVocabularies);
            if (result instanceof Error) {
                return setVocabularyResult({
                    ...vocabularyResult,
                    vocabularies: [],
                    error: result,
                    isLoading: false,
                });
            }

            setVocabularyResult({
                ...vocabularyResult,
                vocabularies: result,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [vocabularyListSelected, refreshVocabularies, searchVocabularies]);

    return {
        ...vocabularyResult,
        vocabularyListSelected,
        setSearchVocabularies,
        setVocabularyListSelected,
        onShareVocabularyList,
        onUpdateVocabulary,
        onCreateVocabulary,
        onCreateVocabularyList,
        onDeleteVocabulary,
    };
};

export default useVocabulary;
