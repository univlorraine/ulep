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

        vocabularyListSelected.numberOfVocabularies++;
        setRefreshVocabularies(!refreshVocabularies);
    };

    const onDeleteVocabulary = async (id: string) => {
        if (!vocabularyListSelected) {
            return;
        }
        const result = await deleteVocabulary.execute(id);

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        vocabularyListSelected.numberOfVocabularies--;
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
