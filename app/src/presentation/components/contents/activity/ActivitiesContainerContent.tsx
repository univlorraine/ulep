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

import { useEffect, useState } from 'react';
import { Activity, ActivityTheme } from '../../../../domain/entities/Activity';
import Language from '../../../../domain/entities/Language';
import Profile from '../../../../domain/entities/Profile';
import useGetActivityThemes from '../../../hooks/useGetActivityThemes';
import ActivitiesContent from './ActivitiesContent';
import { ActivityContent } from './ActivityContent';
import CreateActivityContent from './CreateOrUpdateActivityContent';

interface ActivitiesContainerContentProps {
    onClose: () => void;
    profile: Profile;
    isModal?: boolean;
    currentActivityId?: string;
    currentLearningLanguage?: Language;
}

const ActivitiesContainerContent: React.FC<ActivitiesContainerContentProps> = ({
    onClose,
    profile,
    isModal,
    currentActivityId,
    currentLearningLanguage,
}) => {
    const [displayCreateActivity, setDisplayCreateActivity] = useState<boolean>(false);
    const [activityIdToDisplay, setActivityIdToDisplay] = useState<string | undefined>();
    const [activityToUpdate, setActivityToUpdate] = useState<Activity | undefined>();
    const [languageFilter, setLanguageFilter] = useState<Language[]>(
        currentLearningLanguage ? [currentLearningLanguage] : []
    );

    const [proficiencyFilter, setProficiencyFilter] = useState<CEFR[]>([]);
    const [activityThemeFilter, setActivityThemeFilter] = useState<ActivityTheme[]>([]);
    const [shouldTakeAllMineFilter, setShouldTakeAllMineFilter] = useState<boolean>(false);
    const { activityThemes } = useGetActivityThemes();

    const handleNavigateAfterCreate = (activityId: string) => {
        setActivityIdToDisplay(activityId);
        setDisplayCreateActivity(false);
    };

    const handleUpdateActivity = (activity: Activity) => {
        setActivityToUpdate(activity);
        setDisplayCreateActivity(true);
        setActivityIdToDisplay(undefined);
    };

    const onBackPressed = () => {
        setActivityToUpdate(undefined);
        setDisplayCreateActivity(false);
        setActivityIdToDisplay(undefined);
    };

    useEffect(() => {
        if (currentActivityId) {
            setActivityIdToDisplay(currentActivityId);
        }
    }, [currentActivityId]);

    return (
        <>
            {!displayCreateActivity && !activityIdToDisplay && (
                <ActivitiesContent
                    onAddActivity={() => setDisplayCreateActivity(true)}
                    onBackPressed={onClose}
                    themes={activityThemes}
                    onActivityClick={(activity) => setActivityIdToDisplay(activity.id)}
                    profile={profile}
                    isModal={isModal}
                    languageFilter={languageFilter}
                    setLanguageFilter={setLanguageFilter}
                    proficiencyFilter={proficiencyFilter}
                    setProficiencyFilter={setProficiencyFilter}
                    activityThemeFilter={activityThemeFilter}
                    setActivityThemeFilter={setActivityThemeFilter}
                    shouldTakeAllMineFilter={shouldTakeAllMineFilter}
                    setShouldTakeAllMineFilter={setShouldTakeAllMineFilter}
                />
            )}
            {displayCreateActivity && (
                <CreateActivityContent
                    themes={activityThemes}
                    onBackPressed={onBackPressed}
                    profile={profile}
                    onNavigatePressed={handleNavigateAfterCreate}
                    activityToUpdate={activityToUpdate}
                />
            )}
            {activityIdToDisplay && (
                <ActivityContent
                    onBackPressed={onBackPressed}
                    onUpdateActivityPressed={handleUpdateActivity}
                    activityId={activityIdToDisplay}
                    profile={profile}
                />
            )}
        </>
    );
};

export default ActivitiesContainerContent;
