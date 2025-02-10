import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, WithRecord, Edit, usePermissions } from 'react-admin';
import ReportForm from '../../components/form/ReportForm';
import ReportsPagesHeader from '../../components/tabs/ReportsPagesHeader';
import { Role } from '../../entities/Administrator';
import Report, { ReportStatus } from '../../entities/Report';

const EditReport = () => {
    const translate = useTranslate();

    const { permissions } = usePermissions();
    const canEdit = permissions.checkRoles([Role.MANAGER, Role.SUPER_ADMIN]);
    if (!canEdit) {
        return <div>{translate('reports.error.unauthorized')}</div>;
    }

    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (id: string, status: ReportStatus, comment?: string, shouldDeleteMessage?: boolean) => {
        const payload = {
            status,
            comment,
            shouldDeleteMessage,
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
        <>
            <ReportsPagesHeader />
            <Edit title={translate('reports.update.title')}>
                <WithRecord<Report>
                    render={(record) => (
                        <ReportForm
                            category={record.category.name}
                            comment={record.comment}
                            content={record.content}
                            handleSubmit={(status: ReportStatus, comment?: string, shouldDeleteMessage?: boolean) =>
                                handleSubmit(record.id, status, comment, shouldDeleteMessage)
                            }
                            isMessageDeleted={record.metadata?.isMessageDeleted}
                            messageId={record.metadata?.messageId}
                            status={record.status}
                            user={record.user}
                        />
                    )}
                />
            </Edit>
        </>
    );
};

export default EditReport;
