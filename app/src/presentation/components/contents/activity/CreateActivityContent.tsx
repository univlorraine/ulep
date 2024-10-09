import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { t } from 'i18next';
import { arrowBackOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useConfig } from '../../../../context/ConfigurationContext';
import { Activity, ActivityTheme, ActivityThemeCategory } from '../../../../domain/entities/Activity';
import Language from '../../../../domain/entities/Language';
import Profile from '../../../../domain/entities/Profile';
import { CreateActivityCommand } from '../../../../domain/interfaces/activity/CreateActivityUsecase.interface';
import useGetDataForActivityCreation from '../../../hooks/useGetDataForActivityCreation';
import CreateActivityExcerciseContent from './CreateActivityExcerciseContent';
import CreateActivityInformationsContent from './CreateActivityInformationsContent';
import CreateActivitySuccessContent from './CreateActivitySuccessContent';
import CreateActivityVocabularyContent from './CreateActivityVocabularyContent';

enum CreateActivityMode {
    INFORMATIONS = 'INFORMATIONS',
    EXERCICES = 'EXERCICES',
    VOCABULARY = 'VOCABULARY',
    SUCCESS = 'SUCCESS',
}

interface CreateActivityContentProps {
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

export const CreateActivityContent: React.FC<CreateActivityContentProps> = ({
    onBackPressed,
    onNavigatePressed,
    profile,
    themes,
}) => {
    const [showToast] = useIonToast();
    const [mode, setMode] = useState<CreateActivityMode>(CreateActivityMode.INFORMATIONS);
    const [informations, setInformations] = useState<CreateActivityInformationsOutput>();
    const [excercises, setExcercises] = useState<{ content: string; order: number }[]>();
    const [activity, setActivity] = useState<Activity>();
    const { createActivity } = useConfig();

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

    const { activityThemesDropDown, cefrLevelsDropDown, languagesDropDown } = useGetDataForActivityCreation(
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

    const handleInformationsSubmit = (data: CreateActivityInformationsOutput) => {
        setInformations(data);
        setMode(CreateActivityMode.EXERCICES);
    };

    const handleExcerciseSubmit = (data: { content: string; order: number }[]) => {
        setExcercises(data);
        setMode(CreateActivityMode.VOCABULARY);
    };

    const handleVocabularySubmit = (data: { content: string; file?: File }[]) => {
        if (!informations || !excercises) {
            return;
        }
        onCreateActivity({
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
        });
    };

    const renderContent = () => {
        switch (mode) {
            case CreateActivityMode.INFORMATIONS:
                return (
                    <CreateActivityInformationsContent
                        activityThemesDropDown={activityThemesDropDown}
                        cefrLevelsDropDown={cefrLevelsDropDown}
                        languagesDropDown={languagesDropDown}
                        onBackPressed={handleBackPressed}
                        onSubmit={handleInformationsSubmit}
                    />
                );
            case CreateActivityMode.EXERCICES:
                return (
                    <CreateActivityExcerciseContent
                        onSubmit={handleExcerciseSubmit}
                        onBackPressed={handleBackPressed}
                    />
                );
            case CreateActivityMode.VOCABULARY:
                return (
                    <CreateActivityVocabularyContent
                        onBackPressed={handleBackPressed}
                        onSubmit={handleVocabularySubmit}
                    />
                );
            case CreateActivityMode.SUCCESS:
                return (
                    <CreateActivitySuccessContent
                        onBackPressed={handleBackPressed}
                        activity={activity!}
                        onNavigatePressed={onNavigatePressed}
                    />
                );
        }
    };

    return (
        <div className="subcontent-container content-wrapper">
            <div className="subcontent-header">
                <IonButton
                    fill="clear"
                    onClick={handleBackPressed}
                    aria-label={t('activity.create.back_button') as string}
                >
                    <IonIcon icon={arrowBackOutline} color="dark" />
                </IonButton>
                <p className="subcontent-title">{t('activity.create.title')}</p>
                <div />
            </div>
            {renderContent()}
        </div>
    );
};

export default CreateActivityContent;
