import React from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import ObjectiveForm from '../../components/form/ObjectiveForm';
import Translation from '../../entities/Translation';

const CreateObjective = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (name: string, translations: { index: number; item: Translation }[], file?: File) => {
        const formData = new FormData();
        formData.append('name', name || '');
        if (file) {
            formData.append('file', file);
        }

        translations
            .map((translation) => translation.item)
            .filter((translation) => translation.content && translation.language)
            .forEach((translation, index) => {
                formData.append(`translations[${index}][content]`, translation.content);
                formData.append(`translations[${index}][language]`, translation.language);
            });
        try {
            const result = await create('objectives', { data: formData });
            redirect('/objectives');

            return result;
        } catch (err) {
            console.error(err);

            return notify('objectives.create.error');
        }
    };

    return (
        <Create title={translate('objectives.create.title')}>
            <ObjectiveForm handleSubmit={handleSubmit} />
        </Create>
    );
};

export default CreateObjective;
