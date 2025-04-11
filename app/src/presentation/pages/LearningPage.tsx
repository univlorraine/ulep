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

import { IonContent, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import CustomLearningGoal from '../../domain/entities/CustomLearningGoal';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import LearningContent from '../components/contents/LearningContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import ActivitiesContentModal from '../components/modals/ActivitiesContentModal';
import GoalsContentModal, {
    DisplayCustomGoalModal,
    DisplayCustomGoalModalEnum,
} from '../components/modals/GoalsContentModal';
import LearningBookContentModal from '../components/modals/LearningBookContentModal';
import TandemProfileModal from '../components/modals/TandemProfileModal';
import TandemStatusModal from '../components/modals/TandemStatusModal';
import VocabularyContentModal from '../components/modals/VocabularyContentModal';
import useGetLearningData from '../hooks/useGetLearningData';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

interface LearningPageLocationState {
    activityId?: string;
    tandem?: Tandem;
    openNewEntry?: boolean;
}

const LearningPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation<LearningPageLocationState>();
    const activityId = location.state?.activityId;
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const [refresh, setRefresh] = useState<boolean>(false);
    const { currentLearningWorkspace } = useStoreState((state) => state);
    const [currentTandem, setCurrentTandem] = useState<Tandem | undefined>(
        currentLearningWorkspace || location.state?.tandem
    );
    const [displaySelectedTandem, setDisplaySelectedTandem] = useState<Tandem>();
    const [displayActivitiesContent, setDisplayActivitiesContent] = useState<boolean>(false);
    const [displayVocabularyContent, setDisplayVocabularyContent] = useState<boolean>(false);
    const [displayLearningBookContent, setDisplayLearningBookContent] = useState<boolean>(false);
    const [displayCustomGoalModal, setDisplayCustomGoalModal] = useState<DisplayCustomGoalModal>();
    const [currentActivityId, setCurrentActivityId] = useState<string>();
    const [currentVocabularyListId, setCurrentVocabularyListId] = useState<string>();
    const profile = useStoreState((state: any) => state.profile);
    const { tandems, error, isLoading } = useGetLearningData(refresh);

    useEffect(() => {
        if (tandems.length > 0) {
            const refreshedCurrentTandem = currentTandem && tandems.find((tandem) => tandem.id === currentTandem.id);
            const tandem = refreshedCurrentTandem ?? tandems[0];
            setCurrentTandem(tandem);
        }
    }, [tandems, currentTandem]);

    useEffect(() => {
        if (activityId) {
            onActivitiesContentPressedFromLearningBook(activityId);
        }
    }, [activityId]);

    useEffect(() => {
        if (location.state?.openNewEntry) {
            setDisplayLearningBookContent(true);
        }
    }, [location.state?.openNewEntry]);

    const onTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setDisplaySelectedTandem(tandem) : history.push('/tandem-status', { tandem });

    const onValidatedTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setDisplaySelectedTandem(tandem) : history.push('/tandem-profil', { tandem });

    const onVocabularyContentPressed = () =>
        !isHybrid ? setDisplayVocabularyContent(true) : history.push('/vocabularies', { tandem: currentTandem });

    const onVocabularyContentPressedFromLearningBook = (vocabularyListId: string) => {
        if (!isHybrid) {
            setDisplayLearningBookContent(false);
            setDisplayVocabularyContent(true);
            setCurrentVocabularyListId(vocabularyListId);
        } else {
            history.push('/vocabularies', { tandem: currentTandem, vocabularyListId });
        }
    };

    const onVocabularyModalClosed = () => {
        setDisplayVocabularyContent(false);
        setCurrentVocabularyListId(undefined);
    };

    const onActivitiesContentPressedFromLearningBook = (activityId: string) => {
        if (!isHybrid) {
            setDisplayLearningBookContent(false);
            setDisplayActivitiesContent(true);
            setCurrentActivityId(activityId);
        } else {
            history.push('/activities', { activityId });
        }
    };

    const onActivitiesModalClosed = () => {
        setDisplayActivitiesContent(false);
        setCurrentActivityId(undefined);
    };

    const onLearningBookContentPressed = () =>
        !isHybrid ? setDisplayLearningBookContent(true) : history.push('/learning-book', { tandem: currentTandem });

    const onActivitiesContentPressed = () =>
        !isHybrid
            ? setDisplayActivitiesContent(true)
            : history.push('/activities', { learningLanguage: currentTandem?.learningLanguage });

    const onShowAllGoalsPressed = (customLearningGoals?: CustomLearningGoal[]) => {
        setRefresh(!refresh);
        !isHybrid
            ? setDisplayCustomGoalModal({ type: DisplayCustomGoalModalEnum.list })
            : history.push('/goals', { customLearningGoals, learningLanguageId: currentTandem?.learningLanguage?.id });
    };

    const onAddCustomGoalPressed = () => {
        setDisplayCustomGoalModal({
            type: DisplayCustomGoalModalEnum.form,
        });
    };

    const onShowCustomGoalPressed = (
        customLearningGoal: CustomLearningGoal,
        customLearningGoals?: CustomLearningGoal[]
    ) => {
        setRefresh(!refresh);
        setDisplayCustomGoalModal({ type: DisplayCustomGoalModalEnum.show, customLearningGoal, customLearningGoals });
    };

    const onUpdateCustomGoalPressed = (customLearningGoal: CustomLearningGoal) => {
        setDisplayCustomGoalModal({ type: DisplayCustomGoalModalEnum.form, customLearningGoal });
    };

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <IonContent>
                <LearningContent
                    isLoading={isLoading}
                    profile={profile}
                    tandems={tandems}
                    currentTandem={currentTandem}
                    onTandemPressed={onTandemPressed}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    onVocabularyListPressed={onVocabularyContentPressed}
                    onActivitiesContentPressed={onActivitiesContentPressed}
                    onLearningBookContentPressed={onLearningBookContentPressed}
                    onShowAllGoalsPressed={onShowAllGoalsPressed}
                    setCurrentTandem={setCurrentTandem}
                />
            </IonContent>
        );
    }

    return (
        <>
            <OnlineWebLayout>
                <LearningContent
                    isLoading={isLoading}
                    profile={profile}
                    tandems={tandems}
                    currentTandem={currentTandem}
                    onTandemPressed={onTandemPressed}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    onVocabularyListPressed={onVocabularyContentPressed}
                    onActivitiesContentPressed={onActivitiesContentPressed}
                    onLearningBookContentPressed={onLearningBookContentPressed}
                    onShowAllGoalsPressed={onShowAllGoalsPressed}
                    setCurrentTandem={setCurrentTandem}
                />
            </OnlineWebLayout>
            <TandemStatusModal
                isVisible={
                    !!displaySelectedTandem &&
                    (displaySelectedTandem.status === 'DRAFT' ||
                        displaySelectedTandem.status === 'INACTIVE' ||
                        displaySelectedTandem.status === 'VALIDATED_BY_ONE_UNIVERSITY')
                }
                onClose={() => setDisplaySelectedTandem(undefined)}
                onFindNewTandem={() => history.push('pairing/languages')}
                status={displaySelectedTandem?.status}
            />
            <TandemProfileModal
                isVisible={!!displaySelectedTandem && displaySelectedTandem.status === 'ACTIVE'}
                id={displaySelectedTandem?.id}
                learningLanguage={displaySelectedTandem?.learningLanguage}
                level={displaySelectedTandem?.level}
                onClose={() => setDisplaySelectedTandem(undefined)}
                partnerLearningLanguage={displaySelectedTandem?.partnerLearningLanguage}
                pedagogy={displaySelectedTandem?.pedagogy}
                profile={displaySelectedTandem?.partner}
            />
            <LearningBookContentModal
                isVisible={displayLearningBookContent}
                onClose={() => setDisplayLearningBookContent(false)}
                learningLanguage={currentTandem?.learningLanguage}
                onOpenVocabularyList={onVocabularyContentPressedFromLearningBook}
                onOpenActivity={onActivitiesContentPressedFromLearningBook}
                profile={profile}
                openNewEntry={location.state?.openNewEntry}
            />
            <ActivitiesContentModal
                isVisible={displayActivitiesContent}
                onClose={onActivitiesModalClosed}
                profile={profile}
                currentActivityId={currentActivityId}
                currentLearningLanguage={currentTandem?.learningLanguage}
            />
            {currentTandem && (
                <VocabularyContentModal
                    isVisible={displayVocabularyContent}
                    onClose={onVocabularyModalClosed}
                    profile={profile}
                    currentVocabularyListId={currentVocabularyListId}
                    currentLearningLanguage={currentTandem.learningLanguage}
                />
            )}
            {tandems.length > 0 && (
                <GoalsContentModal
                    isVisible={Boolean(displayCustomGoalModal)}
                    onClose={() => setDisplayCustomGoalModal(undefined)}
                    displayCustomGoalModal={displayCustomGoalModal}
                    profile={profile}
                    learningLanguage={currentTandem?.learningLanguage || tandems[0].learningLanguage}
                    onAddCustomGoalPressed={onAddCustomGoalPressed}
                    onShowCustomGoalPressed={onShowCustomGoalPressed}
                    onUpdateCustomGoalPressed={onUpdateCustomGoalPressed}
                    onShowAllGoalsPressed={onShowAllGoalsPressed}
                />
            )}
        </>
    );
};

export default LearningPage;
