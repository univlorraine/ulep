import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, WithRecord, Edit } from 'react-admin';
import ReportForm from '../../components/form/ReportForm';
import IndexedTranslation from '../../entities/IndexedTranslation';
import ReportCategory from '../../entities/ReportCategory';
import Translation from '../../entities/Translation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const EditReportCategory = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (id: string, name: string, translations: IndexedTranslation[]) => {
        const payload = {
            id,
            name,
            translations: indexedTranslationsToTranslations(translations),
        };
        try {
            return await update(
                'reports/categories',
                { data: payload },
                {
                    onSettled: (data: any, error: Error) => {
                        if (!error) {
                            return redirect('/reports/categories');
                        }

                        return notify('report_categories.update.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('report_categories.update.error');
        }
    };

    return (
        <Edit title={translate('report_categories.update.title')}>
            <WithRecord
                label="interests"
                render={(record: ReportCategory) => (
                    <ReportForm
                        handleSubmit={(name: string, translations: IndexedTranslation[]) =>
                            handleSubmit(record.id, name, translations)
                        }
                        name={record.name.content}
                        tradKey="update"
                        translations={record.name.translations?.map(
                            (translation: Translation, index: number) => new IndexedTranslation(index, translation)
                        )}
                    />
                )}
            />
        </Edit>
    );
};

export default EditReportCategory;
