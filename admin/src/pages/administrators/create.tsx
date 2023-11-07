import React from 'react';
import { useNotify, useRedirect, useCreate, Create, useTranslate } from 'react-admin';
import AdministratorForm from '../../components/form/AdministratorForm';
import University from '../../entities/University';

interface AdministratorCreatePayload {
    email: string;
    password?: string;
    universityId?: string;
}

const CreateAdministrator = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (email: string, password?: string, university?: University) => {
        const payload: AdministratorCreatePayload = {
            email,
            password,
        };

        if (university?.parent) {
            payload.universityId = university.id;
        }

        try {
            return await create(
                'users/administrators',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/users/administrators');
                        }

                        return notify('administrators.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('administrators.create.error');
        }
    };

    return (
        <Create title={translate('administrators.create.title')}>
            <AdministratorForm handleSubmit={handleSubmit} type="create" />
        </Create>
    );
};

export default CreateAdministrator;
