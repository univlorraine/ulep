import { useUpdate, useNotify, useRedirect, useTranslate, Edit } from 'react-admin';
import ActivityForm from '../../components/form/ActivityForm';
import PageTitle from '../../components/PageTitle';
import { ActivityExercise, ActivityVocabulary } from '../../entities/Activity';

const EditActivity = () => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const [update] = useUpdate();

    type handleUpdateSubmitPayload = {
        id: string;
        title: string;
        description: string;
        image?: File | string;
        creditImage?: string;
        language: string;
        languageLevel: string;
        themeId: string;
        ressourceUrl?: string;
        resourceFile?: File | string;
        universityId: string;
        exercises: ActivityExercise[];
        vocabularies: ActivityVocabulary[];
    };

    const handleSubmit = async (payload: handleUpdateSubmitPayload) => {
        const vocabulariesFiles: File[] = [];
        payload.vocabularies?.forEach((vocabulary: ActivityVocabulary) => {
            if (vocabulary.file) {
                const newFile = new File([vocabulary.file], `${vocabulary.content}.wav`, {
                    type: vocabulary.file.type,
                });
                vocabulariesFiles.push(newFile);
            }
        });

        const formData = new FormData();

        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('languageLevel', payload.languageLevel);
        formData.append('languageCode', payload.language);
        formData.append('themeId', payload.themeId);
        payload.exercises.forEach((exercise: any, index: number) => {
            formData.append(`exercises[${index}][content]`, exercise.content);
            formData.append(`exercises[${index}][order]`, exercise.order);
        });
        payload.vocabularies.forEach((vocabulary: any, index: number) => {
            formData.append(`vocabularies[${index}][content]`, vocabulary.content);
            if (vocabulary.pronunciationActivityVocabularyUrl)
                formData.append(
                    `vocabularies[${index}][pronunciationUrl]`,
                    vocabulary.pronunciationActivityVocabularyUrl
                );
            if (vocabulary.id) formData.append(`vocabularies[${index}][id]`, vocabulary.id);
        });
        vocabulariesFiles?.forEach((vocabularyFile: File, index: number) => {
            formData.append(`vocabulariesFiles[${index}]`, vocabularyFile);
        });
        if (payload.image) formData.append('image', payload.image);
        if (payload.creditImage) formData.append('creditImage', payload.creditImage);
        if (payload.ressourceUrl) formData.append('ressourceUrl', payload.ressourceUrl);
        if (payload.resourceFile) formData.append('ressource', payload.resourceFile);

        await update(
            'activities',
            { id: payload.id, data: formData },
            {
                onSettled: (_, error: unknown) => {
                    if (!error) {
                        return redirect('/activities');
                    }

                    return notify('activities.error.update', {
                        type: 'error',
                    });
                },
            }
        );
    };

    return (
        <>
            <PageTitle>{translate('activities.label')}</PageTitle>
            <Edit>
                <ActivityForm handleSubmit={handleSubmit} />
            </Edit>
        </>
    );
};

export default EditActivity;
