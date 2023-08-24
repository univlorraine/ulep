import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import InterestForm from '../../components/form/InterestForm';
import IndexedTranslation from '../../entities/IndexedTranslation';
import Interest from '../../entities/Interest';
import Translation from '../../entities/Translation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const EditInterest = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (id: string, newInterest: string, newTranslations: IndexedTranslation[]) => {
        const payload = {
            id,
            name: newInterest,
            translations: indexedTranslationsToTranslations(newTranslations),
        };
        try {
            const result = await update('interests', { data: payload });
            redirect('/interests/categories');

            return result;
        } catch (err) {
            console.error(err);

            return notify('interest.update.error');
        }
    };

    return (
        <Edit title={translate('interests.update.title')}>
            <WithRecord
                label="interests"
                render={(record: Interest) => (
                    <InterestForm
                        handleSubmit={(name: string, translations: IndexedTranslation[]) =>
                            handleSubmit(record.id, name, translations)
                        }
                        name={record.name.content}
                        translations={record.name.translations?.map(
                            (translation: Translation, index: number) => new IndexedTranslation(index, translation)
                        )}
                    />
                )}
            />
        </Edit>
    );
};

export default EditInterest;
