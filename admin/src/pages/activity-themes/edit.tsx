import React from 'react';
import { useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import ActivityCategoryForm from '../../components/form/ActivityCategoryForm';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import { ActivityThemeDetails } from '../../entities/ActivityTheme';
import IndexedTranslation from '../../entities/IndexedTranslation';
import Translation from '../../entities/Translation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const EditActivityTheme = () => {
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (id: string, newName: string, newTranslations: IndexedTranslation[]) => {
        const payload = {
            content: newName,
            translations: indexedTranslationsToTranslations(newTranslations),
        };
        try {
            return await update(
                'activities/themes',
                { id, data: payload },
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
                <WithRecord<ActivityThemeDetails>
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

export default EditActivityTheme;
