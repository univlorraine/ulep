import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import InterestForm from '../../components/form/InterestForm';
import IndexedTranslation from '../../entities/IndexedTranslation';
import InterestCategory from '../../entities/InterestCategory';
import Translation from '../../entities/Translation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const EditInterestCategory = () => {
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
            return await update(
                'interests/categories',
                { data: payload },
                {
                    onSettled: () => {
                        redirect('/interests/categories');

                        return notify('interest_categories.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('interest.update.error');
        }
    };

    return (
        <Edit title={translate('interest_categories.update.title')}>
            <WithRecord
                label="interests/categories/"
                render={(record: InterestCategory) => (
                    <InterestForm
                        handleSubmit={(name: string, translations: IndexedTranslation[]) =>
                            handleSubmit(record.id, name, translations)
                        }
                        name={record.name.content}
                        tradKey="interest_categories"
                        translations={record.name.translations?.map(
                            (translation: Translation, index: number) => new IndexedTranslation(index, translation)
                        )}
                    />
                )}
            />
        </Edit>
    );
};

export default EditInterestCategory;
