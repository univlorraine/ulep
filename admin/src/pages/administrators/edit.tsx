import React from 'react';
import { useNotify, useRedirect, Edit, useTranslate, useUpdate, WithRecord } from 'react-admin';
import AdministratorForm from '../../components/form/AdministratorForm';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import Administrator, { AdministratorFormPayload } from '../../entities/Administrator';

const EditAdministrator = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (payload: AdministratorFormPayload) => {
        try {
            return await update(
                'users/administrators',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/users/administrators');
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
        <>
            <ConfigPagesHeader />
            <Edit title={translate('administrators.update.title')}>
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
                        />
                    )}
                />
            </Edit>
        </>
    );
};

export default EditAdministrator;
