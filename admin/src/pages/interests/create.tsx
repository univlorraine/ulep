import React from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import { useLocation } from 'react-router-dom';
import InterestForm from '../../components/form/InterestForm';
import ConfigTabs from '../../components/tabs/ConfigTabs';
import IndexedTranslation from '../../entities/IndexedTranslation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const CreateInterest = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();
    const { state } = useLocation();
    const category = state?.category;

    const handleSubmit = async (name: string, translations: IndexedTranslation[]) => {
        const payload = {
            name,
            category,
            translations: indexedTranslationsToTranslations(translations),
        };
        try {
            return await create(
                'interests',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/interests/categories');
                        }

                        return notify('interests.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('interests.create.error');
        }
    };

    return (
        <>
            <ConfigTabs />
            <Create title={translate('interests.create.title')}>
                <InterestForm handleSubmit={handleSubmit} tradKey="interests" tradModeKey="create" />
            </Create>
        </>
    );
};

export default CreateInterest;
