import React from 'react';
import { useNotify, useRedirect, Edit, useTranslate, useUpdate, WithRecord } from 'react-admin';
import AdministratorForm from '../../components/form/AdministratorForm';
import Administrator from '../../entities/Administrator';

interface AdministratorUpdatePayload {
    id: string;
    email?: string;
    password?: string;
    universityId?: string;
}

const EditAdministrator = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (id: string, email: string, password?: string, universityId?: string) => {
        const payload: AdministratorUpdatePayload = {
            id,
            email,
            password,
            universityId,
        };

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
        <Edit title={translate('administrators.update.title')}>
            <WithRecord<Administrator>
                label="user/administrator"
                render={(record) => (
                    <AdministratorForm
                        email={record.email}
                        handleSubmit={(email: string, password?: string, universityId?: string) =>
                            handleSubmit(record.id, email, password, universityId)
                        }
                        type="update"
                        universityId={record.universityId || 'central'}
                    />
                )}
            />
        </Edit>
    );
};

export default EditAdministrator;
