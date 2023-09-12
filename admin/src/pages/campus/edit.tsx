import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import CampusForm from '../../components/form/CampusForm';
import Campus from '../../entities/Campus';

const EditCampus = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (id: string, newName: string) => {
        const payload = {
            id,
            name: newName,
        };
        try {
            return await update(
                'campus',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/campus');
                        }

                        return notify('campus.update.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('campus.update.error');
        }
    };

    return (
        <Edit title={translate('campus.update.title')}>
            <WithRecord<Campus>
                label="campus"
                render={(record) => (
                    <CampusForm
                        handleSubmit={(newName: string) => handleSubmit(record.id, newName)}
                        name={record.name}
                    />
                )}
            />
        </Edit>
    );
};

export default EditCampus;
