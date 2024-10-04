import { Create, useCreate, useNotify, useRedirect, useTranslate } from 'react-admin';
import ActivityForm from '../../components/form/ActivityForm';
import PageTitle from '../../components/PageTitle';
import { ActivityVocabulary } from '../../entities/Activity';

const CreateActivity = () => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const [create] = useCreate();

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
        formData.append('universityId', payload.universityId);
        formData.append('image', payload.image);
        formData.append('creditImage', payload.creditImage);
        formData.append('ressourceUrl', payload.ressourceUrl);
        payload.exercises.forEach((exercise: any, index: number) => {
            formData.append(`exercises[${index}][content]`, exercise.content);
            formData.append(`exercises[${index}][order]`, exercise.order);
        });
        payload.vocabularies.forEach((vocabulary: any, index: number) => {
            formData.append(`vocabularies[${index}]`, vocabulary.content);
        });
        vocabulariesFiles?.forEach((vocabularyFile: File, index: number) => {
            formData.append(`vocabulariesFiles[${index}]`, vocabularyFile);
        });
        if (payload.resourceFile) formData.append('ressource', payload.resourceFile);
        if (payload.profileId) formData.append('profileId', payload.profileId);

        try {
            return await create(
                'activities',
                { data: formData },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/activities');
                        }

                        return notify('activities.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('activities.create.error');
        }
    };

    return (
        <>
            <PageTitle>{translate('activities.label')}</PageTitle>
            <Create title={translate('activities.create.title')}>
                <ActivityForm handleSubmit={handleSubmit} />
            </Create>
        </>
    );
};

export default CreateActivity;
