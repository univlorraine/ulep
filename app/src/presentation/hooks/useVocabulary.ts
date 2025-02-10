import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import LearningLanguage from '../../domain/entities/LearningLanguage';
import Profile from '../../domain/entities/Profile';
import Tandem from '../../domain/entities/Tandem';
import Vocabulary from '../../domain/entities/Vocabulary';
import VocabularyList from '../../domain/entities/VocabularyList';
import { CreateVocabularyListCommand } from '../../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import { UpdateVocabularyListCommand } from '../../domain/interfaces/vocabulary/UpdateVocabularyListUsecase.interface';
import { useStoreState } from '../../store/storeTypes';

const useVocabulary = (learningLanguage?: LearningLanguage) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const {
        getAllTandems,
        getVocabularyLists,
        getVocabularies,
        createVocabularyList,
        updateVocabularyList,
        updateVocabulary,
        createVocabulary,
        deleteVocabulary,
        deleteVocabularyList,
    } = useConfig();
    const [associatedTandem, setAssociatedTandem] = useState<Tandem>();
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
            associatedTandem,
            searchVocabularies,
            setSearchVocabularies,
            setVocabularyListSelected,
            onShareVocabularyList: () => {},
            onUpdateVocabulary: () => {},
            onCreateVocabulary: () => {},
            onCreateVocabularyList: () => {},
            onDeleteVocabulary: () => {},
            onUpdateVocabularyList: () => {},
            onDeleteVocabularyList: () => {},
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

        showToast(t('vocabulary.list.share.success'), 3000);
        setVocabularyListSelected(result);
        setRefreshVocabularyLists(!refreshVocabularyLists);
    };

    const onUpdateVocabularyList = async (id: string, command: UpdateVocabularyListCommand) => {
        if (!vocabularyListSelected) {
            return;
        }
        const result = await updateVocabularyList.execute(id, command);

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setVocabularyListSelected(result);
        setRefreshVocabularyLists(!refreshVocabularyLists);
    };

    const onUpdateVocabulary = async (
        id: string,
        word: string,
        translation?: string,
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
        translation?: string,
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

    const onDeleteVocabularyList = async () => {
        if (!vocabularyListSelected) {
            return;
        }

        const result = await deleteVocabularyList.execute(vocabularyListSelected.id);

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setVocabularyListSelected(undefined);
        setRefreshVocabularyLists(!refreshVocabularyLists);
    };

    useEffect(() => {
        const getProfilesTandems = async () => {
            if (!profile) {
                return [];
            }
            const tandems = await getAllTandems.execute(profile.id);

            if (tandems instanceof Error) {
                return [];
            }

            const associatedTandem = tandems.find((tandem) => tandem.learningLanguage?.id === learningLanguage?.id);

            if (associatedTandem) {
                setAssociatedTandem(associatedTandem);
            }
        };
        getProfilesTandems();
    }, [profile]);

    useEffect(() => {
        const fetchData = async () => {
            if (!learningLanguage) {
                return;
            }

            setVocabularyResult({
                ...vocabularyResult,
                isLoading: true,
            });

            const vocabularyListsResult = await getVocabularyLists.execute(profile.id, learningLanguage.code);

            if (vocabularyListsResult instanceof Error) {
                return setVocabularyResult({
                    ...vocabularyResult,
                    vocabularyLists: [],
                    error: vocabularyListsResult,
                    isLoading: false,
                });
            }

            setRefreshVocabularies(!refreshVocabularies);
            setVocabularyResult({
                ...vocabularyResult,
                vocabularyLists: vocabularyListsResult,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [learningLanguage, refreshVocabularyLists, vocabularyListSelected]);

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

    useEffect(() => {
        setSearchVocabularies('');
    }, [vocabularyListSelected]);

    return {
        ...vocabularyResult,
        vocabularyListSelected,
        associatedTandem,
        searchVocabularies,
        setSearchVocabularies,
        setVocabularyListSelected,
        onShareVocabularyList,
        onUpdateVocabulary,
        onCreateVocabulary,
        onCreateVocabularyList,
        onDeleteVocabulary,
        onUpdateVocabularyList,
        onDeleteVocabularyList,
    };
};

export default useVocabulary;
