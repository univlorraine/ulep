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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../../context/ConfigurationContext';
import { Activity, ActivityTheme, ActivityThemeCategory } from '../../../../domain/entities/Activity';
import Language from '../../../../domain/entities/Language';
import Profile from '../../../../domain/entities/Profile';
import { CreateActivityCommand } from '../../../../domain/interfaces/activity/CreateActivityUsecase.interface';
import { UpdateActivityCommand } from '../../../../domain/interfaces/activity/UpdateActivityUsecase.interface';
import useGetDataForActivityCreation from '../../../hooks/useGetDataForActivityCreation';
import HeaderSubContent from '../../HeaderSubContent';
import CreateActivityExcerciseContent from './CreateActivityExcerciseContent';
import CreateActivityInformationsContent from './CreateActivityInformationsContent';
import CreateActivitySuccessContent from './CreateActivitySuccessContent';
import CreateActivityVocabularyContent from './CreateActivityVocabularyContent';
import styles from './CreateOrUpdateActivityContent.module.css';

enum CreateActivityMode {
    INFORMATIONS = 'INFORMATIONS',
    EXERCICES = 'EXERCICES',
    VOCABULARY = 'VOCABULARY',
    SUCCESS = 'SUCCESS',
}

interface CreateActivityContentProps {
    activityToUpdate?: Activity;
    themes: ActivityThemeCategory[];
    onBackPressed: () => void;
    onNavigatePressed: (activityId: string) => void;
    profile: Profile;
}

export interface CreateActivityInformationsOutput {
    title: string;
    description: string;
    language: Language;
    theme: ActivityTheme;
    level: CEFR;
    image: File;
    creditImage?: string;
    ressourceUrl?: string;
    ressource?: File;
}

export interface UpdateActivityInformationsOutput {
    title: string;
    description: string;
    language: Language;
    theme: ActivityTheme;
    level: CEFR;
    image?: File;
    creditImage?: string;
    ressourceUrl?: string;
    ressource?: File;
}

export const CreateActivityContent: React.FC<CreateActivityContentProps> = ({
    activityToUpdate,
    onBackPressed,
    onNavigatePressed,
    profile,
    themes,
}) => {
    const [showToast] = useIonToast();
    const { t } = useTranslation();
    const [mode, setMode] = useState<CreateActivityMode>(CreateActivityMode.INFORMATIONS);
    const [informations, setInformations] = useState<
        CreateActivityInformationsOutput | UpdateActivityInformationsOutput
    >();
    const [excercises, setExcercises] = useState<{ content: string; order: number }[]>();
    const [activity, setActivity] = useState<Activity>();
    const { createActivity, updateActivity } = useConfig();

    const onCreateActivity = async (data: CreateActivityCommand) => {
        const result = await createActivity.execute(data);
        if (result instanceof Error) {
            return showToast({
                message: result.message,
                duration: 3000,
            });
        }
        setMode(CreateActivityMode.SUCCESS);
        setActivity(result);
    };

    const onUpdateActivity = async (data: UpdateActivityCommand) => {
        const result = await updateActivity.execute(activityToUpdate!.id, data);
        if (result instanceof Error) {
            return showToast({
                message: result.message,
                duration: 3000,
            });
        }
        setMode(CreateActivityMode.SUCCESS);
        setActivity(result);
    };

    const { activityThemesCategoryDropDown, cefrLevelsDropDown, languagesDropDown } = useGetDataForActivityCreation(
        themes,
        profile
    );

    const handleBackPressed = () => {
        switch (mode) {
            case CreateActivityMode.INFORMATIONS:
                onBackPressed();
                break;
            case CreateActivityMode.EXERCICES:
                setMode(CreateActivityMode.INFORMATIONS);
                break;
            case CreateActivityMode.VOCABULARY:
                setMode(CreateActivityMode.EXERCICES);
                break;
            case CreateActivityMode.SUCCESS:
                onBackPressed();
                break;
        }
    };

    const handleInformationsSubmit = (data: CreateActivityInformationsOutput | UpdateActivityInformationsOutput) => {
        setInformations(data);
        setMode(CreateActivityMode.EXERCICES);
    };

    const handleExcerciseSubmit = (data: { content: string; order: number }[]) => {
        setExcercises(data);
        setMode(CreateActivityMode.VOCABULARY);
    };

    const handleVocabularySubmit = async (
        data: {
            id?: string;
            content: string;
            file?: File;
            pronunciationUrl?: string;
        }[]
    ) => {
        if (!informations || !excercises) {
            return;
        }
        if (!activityToUpdate) {
            await onCreateActivity({
                title: informations.title,
                description: informations.description,
                languageLevel: informations.level,
                languageCode: informations.language.code,
                themeId: informations.theme.id,
                image: informations.image,
                ressourceUrl: informations.ressourceUrl,
                ressource: informations.ressource,
                creditImage: informations.creditImage,
                profileId: profile.id,
                exercises: excercises,
                vocabularies: data,
            } as CreateActivityCommand);
        } else {
            await onUpdateActivity({
                title: informations.title,
                description: informations.description,
                languageLevel: informations.level,
                languageCode: informations.language.code,
                themeId: informations.theme.id,
                image: informations.image,
                ressourceUrl: informations.ressourceUrl,
                ressource: informations.ressource,
                creditImage: informations.creditImage,
                exercises: excercises,
                vocabularies: data,
            } as UpdateActivityCommand);
        }
    };

    return (
        <div className={styles.container}>
            <HeaderSubContent title={t('activity.title') as string} onBackPressed={handleBackPressed} />
            <div className={styles.content}>
                {mode === CreateActivityMode.SUCCESS && (
                    <CreateActivitySuccessContent
                        onBackPressed={handleBackPressed}
                        activity={activity!}
                        onNavigatePressed={onNavigatePressed}
                    />
                )}
                {mode === CreateActivityMode.VOCABULARY && (
                    <CreateActivityVocabularyContent
                        onBackPressed={handleBackPressed}
                        onSubmit={handleVocabularySubmit}
                        activityToUpdate={activityToUpdate}
                    />
                )}

                {mode === CreateActivityMode.EXERCICES && (
                    <CreateActivityExcerciseContent
                        onSubmit={handleExcerciseSubmit}
                        onBackPressed={handleBackPressed}
                        activityToUpdate={activityToUpdate}
                    />
                )}

                {mode === CreateActivityMode.INFORMATIONS && (
                    <CreateActivityInformationsContent
                        activityThemesCategoryDropDown={activityThemesCategoryDropDown}
                        cefrLevelsDropDown={cefrLevelsDropDown}
                        languagesDropDown={languagesDropDown}
                        onBackPressed={handleBackPressed}
                        onSubmit={handleInformationsSubmit}
                        activityToUpdate={activityToUpdate}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateActivityContent;
