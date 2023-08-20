import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import ObjectiveForm from '../../components/form/ObjectiveForm';
import Objective from '../../entities/Objective';
import Translation from '../../entities/Translation';

const EditObjective = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (
        id: string,
        newName: string,
        newTranslations: { index: number; item: Translation }[],
        newFile?: File
    ) => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', newName);
        if (newFile) {
            formData.append('file', newFile);
        }

        newTranslations
            .map((translation) => translation.item)
            .filter((translation) => translation.content && translation.language)
            .forEach((translation, index) => {
                formData.append(`translations[${index}][content]`, translation.content);
                formData.append(`translations[${index}][language]`, translation.language);
            });
        try {
            return await update(
                'objectives',
                { data: formData },
                {
                    onSettled: (data: any, err: Error) => {
                        if (!err) {
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
        <Edit title={translate('objectives.create.title')}>
            <WithRecord
                label="objective"
                render={(record: Objective) => (
                    <ObjectiveForm
                        handleSubmit={(
                            name: string,
                            translations: { index: number; item: Translation }[],
                            file?: File
                        ) => handleSubmit(record.id, name, translations, file)}
                        name={record.name.content}
                        tranlsations={record.name.translations.map((translation, index) => ({
                            index,
                            item: translation,
                        }))}
                    />
                )}
            />
        </Edit>
    );
};

export default EditObjective;
