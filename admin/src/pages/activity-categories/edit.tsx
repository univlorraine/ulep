import React from 'react';
import { useNotify, useUpdate, Edit, WithRecord, useRedirect } from 'react-admin';
import ActivityCategoryForm from '../../components/form/ActivityCategoryForm';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import { ActivityThemeCategoryDetails } from '../../entities/ActivityThemeCategory';
import IndexedTranslation from '../../entities/IndexedTranslation';
import Translation from '../../entities/Translation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const EditActivityThemeCategory = () => {
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (id: string, newName: string, newTranslations: IndexedTranslation[]) => {
        const payload = {
            id,
            content: newName,
            translations: indexedTranslationsToTranslations(newTranslations),
        };
        try {
            return await update(
                'activities/categories',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/activities/categories');
                        }

                        return notify('activities_categories.update.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('activities_categories.update.error');
        }
    };

    return (
        <>
            <ConfigPagesHeader />
            <Edit>
                <WithRecord<ActivityThemeCategoryDetails>
                    render={(record) => (
                        <ActivityCategoryForm
                            handleSubmit={(content: string, translations: IndexedTranslation[]) =>
                                handleSubmit(record.id, content, translations)
                            }
                            name={record.content.content}
                            translations={record.content.translations?.map(
                                (translation: Translation, index: number) => new IndexedTranslation(index, translation)
                            )}
                        />
                    )}
                />
            </Edit>
        </>
    );
};

export default EditActivityThemeCategory;
