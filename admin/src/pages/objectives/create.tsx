import React from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import ObjectiveForm from '../../components/form/ObjectiveForm';
import PageTitle from '../../components/PageTitle';
import IndexedTranslation from '../../entities/IndexedTranslation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const CreateObjective = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (name: string, translations: IndexedTranslation[], file?: File) => {
        const formData = new FormData();
        formData.append('name', name || '');
        if (file) {
            formData.append('file', file);
        }

        indexedTranslationsToTranslations(translations).forEach((translation, index) => {
            formData.append(`translations[${index}][content]`, translation.content);
            formData.append(`translations[${index}][language]`, translation.language);
        });
        try {
            return await create(
                'objectives',
                { data: formData },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/objectives');
                        }

                        return notify('objectives.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('objectives.create.error');
        }
    };

    return (
        <>
            <PageTitle>{translate('objectives.title')}</PageTitle>
            <Create title={translate('objectives.create.title')}>
                <ObjectiveForm handleSubmit={handleSubmit} />
            </Create>
        </>
    );
};

export default CreateObjective;
