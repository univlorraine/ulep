import React from 'react';
import { useNotify, Edit, useTranslate, useUpdate, WithRecord } from 'react-admin';
import AdministratorForm from '../../components/form/AdministratorForm';
import Administrator, { AdministratorFormPayload } from '../../entities/Administrator';

const EditAdministratorProfile = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();

    const handleSubmit = async (payload: AdministratorFormPayload) => {
        try {
            return await update(
                'users/administrators',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return notify('ra.notification.updated', { messageArgs: { smart_count: 1 } });
                        }

                        return notify('administrators.update.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('administrators.update.error');
        }
    };

    return (
        <Edit resource="users/administrators" title={translate('administrators.update.title')}>
            <WithRecord<Administrator>
                label="user/administrator"
                render={(record) => (
                    <AdministratorForm
                        email={record.email}
                        firstname={record.firstname}
                        group={record.group}
                        handleSubmit={handleSubmit}
                        id={record.id}
                        lastname={record.lastname}
                        type="update"
                        universityId={record.universityId || 'central'}
                        isProfileEdit
                    />
                )}
            />
        </Edit>
    );
};

export default EditAdministratorProfile;
