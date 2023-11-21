import React from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import CategoryReportForm from '../../components/form/CategoryReportForm';
import IndexedTranslation from '../../entities/IndexedTranslation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const CreateReportCategory = () => {
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
                'reports/categories',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/reports/categories');
                        }

                        return notify('report_categories.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('report_categories.create.error');
        }
    };

    return (
        <Create title={translate('report_categories.create.title')}>
            <CategoryReportForm handleSubmit={handleSubmit} tradKey="create" />
        </Create>
    );
};

export default CreateReportCategory;
