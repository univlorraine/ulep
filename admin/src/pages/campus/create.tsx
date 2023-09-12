import React from 'react';
import { useTranslate, useNotify, useRedirect, useCreate, Create } from 'react-admin';
import CampusForm from '../../components/form/CampusForm';

const CreateCampus = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (newName: string) => {
        const payload = {
            name: newName,
        };
        try {
            return await create(
                'campus',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/campus');
                        }

                        return notify('campus.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('campus.create.error');
        }
    };

    return (
        <Create title={translate('campus.create.title')}>
            <CampusForm handleSubmit={(newName: string) => handleSubmit(newName)} />
        </Create>
    );
};

export default CreateCampus;
