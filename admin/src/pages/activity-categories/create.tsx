import React from 'react';
import { useNotify, useCreate, useRedirect, Create } from 'react-admin';
import ActivityCategoryForm from '../../components/form/ActivityCategoryForm';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import IndexedTranslation from '../../entities/IndexedTranslation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const CreateActivityThemeCategory = () => {
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (newName: string, newTranslations: IndexedTranslation[]) => {
        const payload = {
            content: newName,
            translations: indexedTranslationsToTranslations(newTranslations),
        };
        try {
            return await create(
                'activities/categories',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/activities/categories');
                        }

                        return notify('activities_categories.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('activities_categories.create.error');
        }
    };

    return (
        <>
            <ConfigPagesHeader />
            <Create>
                <ActivityCategoryForm
                    handleSubmit={(content: string, translations: IndexedTranslation[]) =>
                        handleSubmit(content, translations)
                    }
                />
            </Create>
        </>
    );
};

export default CreateActivityThemeCategory;
