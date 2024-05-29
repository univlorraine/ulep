import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import ObjectiveForm from '../../components/form/ObjectiveForm';
import PageTitle from '../../components/PageTitle';
import IndexedTranslation from '../../entities/IndexedTranslation';
import Objective from '../../entities/Objective';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const EditObjective = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (id: string, newName: string, newTranslations: IndexedTranslation[], newFile?: File) => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', newName);
        if (newFile) {
            formData.append('file', newFile);
        }

        indexedTranslationsToTranslations(newTranslations).forEach((translation, index) => {
            formData.append(`translations[${index}][content]`, translation.content);
            formData.append(`translations[${index}][language]`, translation.language);
        });
        try {
            return await update(
                'objectives',
                { data: formData },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/objectives');
                        }

                        return notify('objectives.edit.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('objectives.edit.error');
        }
    };

    return (
        <>
            <PageTitle>{translate('objectives.title')}</PageTitle>
            <Edit title={translate('objectives.update.title')}>
                <WithRecord<Objective>
                    label="objective"
                    render={(record) => (
                        <ObjectiveForm
                            handleSubmit={(name: string, translations: IndexedTranslation[], file?: File) =>
                                handleSubmit(record.id, name, translations, file)
                            }
                            name={record.name.content}
                            tranlsations={record.name.translations.map(
                                (translation, index) => new IndexedTranslation(index, translation)
                            )}
                        />
                    )}
                />
            </Edit>
        </>
    );
};

export default EditObjective;
