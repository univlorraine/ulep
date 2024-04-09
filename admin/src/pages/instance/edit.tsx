import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import InstanceForm from '../../components/form/InstanceForm';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import Instance from '../../entities/Instance';

const EditInstance = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (newInstance: Instance) => {
        try {
            return await update(
                'instance',
                { data: newInstance },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/instance/config/show');
                        }

                        return notify('instance.edit.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('instance.edit.error');
        }
    };

    return (
        <>
            <ConfigPagesHeader />
            <Edit title={translate('instance.edit.title')}>
                <WithRecord<Instance>
                    label="instance"
                    render={(record) => <InstanceForm handleSubmit={handleSubmit} instance={record} />}
                />
            </Edit>
        </>
    );
};

export default EditInstance;
