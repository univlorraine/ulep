import React from 'react';
import { useNotify, useRedirect, useCreate, Create, useTranslate } from 'react-admin';
import AdministratorForm from '../../components/form/AdministratorForm';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import { AdministratorFormPayload } from '../../entities/Administrator';

const CreateAdministrator = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (payload: AdministratorFormPayload) => {
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
        <>
            <ConfigPagesHeader />
            <Create title={translate('administrators.create.title')}>
                <AdministratorForm handleSubmit={handleSubmit} type="create" />
            </Create>
        </>
    );
};

export default CreateAdministrator;
