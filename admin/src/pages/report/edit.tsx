import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, WithRecord, Edit } from 'react-admin';
import ReportForm from '../../components/form/ReportForm';
import Report, { ReportStatus } from '../../entities/Report';

const EditReport = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (id: string, status: ReportStatus, comment?: string) => {
        const payload = {
            status,
            comment,
        };
        try {
            return await update(
                `reports/${id}`,
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/reports');
                        }
                        console.warn(error);

                        return notify('reports.update.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('reports.update.error');
        }
    };

    return (
        <Edit title={translate('reports.update.title')}>
            <WithRecord<Report>
                render={(record) => (
                    <ReportForm
                        category={record.category.name}
                        comment={record.comment}
                        content={record.content}
                        handleSubmit={(status: ReportStatus, comment?: string) =>
                            handleSubmit(record.id, status, comment)
                        }
                        status={record.status}
                        user={record.user}
                    />
                )}
            />
        </Edit>
    );
};

export default EditReport;
