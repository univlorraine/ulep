import React from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import InterestForm from '../../components/form/InterestForm';
import ConfigTabs from '../../components/tabs/ConfigTabs';
import IndexedTranslation from '../../entities/IndexedTranslation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const CreateInterestCategory = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (name: string, translations: IndexedTranslation[]) => {
        const payload = {
            name,
            translations: indexedTranslationsToTranslations(translations),
        };
        try {
            return await create(
                'interests/categories',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/interests/categories');
                        }

                        return notify('interest_categories.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('interest_categories.create.error');
        }
    };

    return (
        <>
            <ConfigTabs />
            <Create title={translate('interest_categories.create.title')}>
                <InterestForm handleSubmit={handleSubmit} tradKey="interest_categories" tradModeKey="create" />
            </Create>
        </>
    );
};

export default CreateInterestCategory;
