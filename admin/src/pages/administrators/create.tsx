import React from 'react';
import { useNotify, useRedirect, useCreate, Create, useTranslate } from 'react-admin';
import AdministratorForm from '../../components/form/AdministratorForm';

interface AdministratorCreatePayload {
    email: string;
    firstname: string;
    lastname: string;
    password?: string;
    universityId?: string;
}

const CreateAdministrator = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (
        email: string,
        firstname: string,
        lastname: string,
        password?: string,
        universityId?: string
    ) => {
        const payload: AdministratorCreatePayload = {
            email,
            firstname,
            lastname,
            password,
            universityId,
        };

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
