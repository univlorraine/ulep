import { useUpdate, useNotify, useRedirect, useTranslate, Edit } from 'react-admin';
import ActivityForm from '../../components/form/ActivityForm';
import PageTitle from '../../components/PageTitle';
import { ActivityVocabulary } from '../../entities/Activity';

const EditActivity = () => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const [update] = useUpdate();

    const handleSubmit = async (payload: any) => {
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
        formData.append('languageCode', payload.languageCode);
        formData.append('themeId', payload.themeId);
        if (payload.image) formData.append('image', payload.image);
        if (payload.creditImage) formData.append('creditImage', payload.creditImage);
        if (payload.ressourceUrl) formData.append('ressourceUrl', payload.ressourceUrl);
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
        if (payload.resourceFile) formData.append('ressource', payload.resourceFile);
        if (payload.profileId) formData.append('profileId', payload.profileId);

        try {
            return await update(
                'activities',
                { id: payload.id, data: formData },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/activities');
                        }

                        return notify('activities.error.update');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('activities.error.update');
        }
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
