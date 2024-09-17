import { IonContent, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Profile from '../../domain/entities/Profile';
import Vocabulary from '../../domain/entities/Vocabulary';
import VocabularyList from '../../domain/entities/VocabularyList';
import { useStoreState } from '../../store/storeTypes';
import CreateOrUpdateVocabularyContent from '../components/contents/CreateOrUpdateVocabularyContent';
import VocabularyContent from '../components/contents/VocabularyContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import ShareVocabularyListModal from '../components/modals/ShareVocabularyListModale';
import useGetVocabulary from '../hooks/useGetVocabulary';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

interface VocabularyPageProps {
    vocabularyList: VocabularyList;
}

const VocabularyPage = () => {
    const { t } = useTranslation();
    const { createVocabulary, getAllTandems, deleteVocabulary, updateVocabulary, updateVocabularyList } = useConfig();
    const history = useHistory();
    const location = useLocation<VocabularyPageProps>();
    const { vocabularyList } = location.state;
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [addContent, setAddContent] = useState(false);
    const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary>();
    const [search, setSearch] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [profilesTandems, setProfilesTandems] = useState<Profile[]>([]);
    const [showShareVocabularyListModal, setShowShareVocabularyListModal] = useState(false);

    const { vocabulary, error, isLoading } = useGetVocabulary(vocabularyList, search, refresh);

    const onAddOrUpdateVocabulary = (vocabulary?: Vocabulary) => {
        setSelectedVocabulary(vocabulary);
        setAddContent(true);
    };

    const onCreateOrUpdateVocabulary = (
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

        setRefresh(!refresh);
        setAddContent(false);
    };

    const onCreateVocabulary = async (
        word: string,
        translation: string,
        wordPronunciation?: File,
        translationPronunciation?: File
    ) => {
        const result = await createVocabulary.execute({
            word,
            translation,
            vocabularyListId: vocabularyList.id,
            wordPronunciation,
            translationPronunciation,
        });

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setRefresh(!refresh);
        setAddContent(false);
    };

    const onDeleteVocabulary = async (id: string) => {
        const result = await deleteVocabulary.execute(id);

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setRefresh(!refresh);
        setAddContent(false);
    };

    const onShareVocabularyList = async (profiles: Profile[]) => {
        const result = await updateVocabularyList.execute(vocabularyList.id, {
            profileIds: profiles.map((profile) => profile.id),
        });

        if (result instanceof Error) {
            return showToast({ message: t(result.message), duration: 5000 });
        }

        setRefresh(!refresh);
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
                    {!addContent ? (
                        <VocabularyContent
                            profile={profile}
                            vocabularyList={vocabularyList}
                            vocabularyPairs={vocabulary}
                            isLoading={isLoading}
                            goBack={() => history.goBack()}
                            onAddVocabulary={onAddOrUpdateVocabulary}
                            onSearch={setSearch}
                            onShareVocabularyList={() => setShowShareVocabularyListModal(true)}
                        />
                    ) : (
                        <CreateOrUpdateVocabularyContent
                            vocabularyList={vocabularyList}
                            goBack={() => setAddContent(false)}
                            vocabulary={selectedVocabulary}
                            onSubmit={onCreateOrUpdateVocabulary}
                            onDelete={onDeleteVocabulary}
                        />
                    )}
                </IonContent>
                <ShareVocabularyListModal
                    isVisible={showShareVocabularyListModal}
                    onClose={() => setShowShareVocabularyListModal(false)}
                    onShareVocabularyList={onShareVocabularyList}
                    tandemsProfiles={profilesTandems}
                    vocabularyList={vocabularyList}
                />
            </>
        );
    }

    return (
        <>
            <OnlineWebLayout profile={profile}>
                {!addContent ? (
                    <VocabularyContent
                        profile={profile}
                        vocabularyList={vocabularyList}
                        vocabularyPairs={vocabulary}
                        isLoading={isLoading}
                        goBack={() => history.goBack()}
                        onAddVocabulary={onAddOrUpdateVocabulary}
                        onSearch={setSearch}
                        onShareVocabularyList={() => setShowShareVocabularyListModal(true)}
                    />
                ) : (
                    <CreateOrUpdateVocabularyContent
                        vocabularyList={vocabularyList}
                        vocabulary={selectedVocabulary}
                        goBack={() => setAddContent(false)}
                        onSubmit={onCreateOrUpdateVocabulary}
                        onDelete={onDeleteVocabulary}
                    />
                )}
            </OnlineWebLayout>
            <ShareVocabularyListModal
                isVisible={showShareVocabularyListModal}
                onClose={() => setShowShareVocabularyListModal(false)}
                onShareVocabularyList={onShareVocabularyList}
                tandemsProfiles={profilesTandems}
                vocabularyList={vocabularyList}
            />
        </>
    );
};

export default VocabularyPage;
