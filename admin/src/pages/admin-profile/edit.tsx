import { Edit, useNotify, useTranslate, useUpdate, WithRecord } from 'react-admin';
import AdministratorForm from '../../components/form/AdministratorForm';
import Administrator, { AdministratorFormPayload } from '../../entities/Administrator';

const EditAdministratorProfile = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();

    const handleSubmit = async (payload: AdministratorFormPayload) => {
        const formData = new FormData();

        formData.append('id', payload.id || '');
        formData.append('email', payload.email || '');
        formData.append('firstname', payload.firstname || '');
        formData.append('lastname', payload.lastname || '');
        formData.append('password', payload.password || '');
        formData.append('universityId', payload.universityId || '');
        formData.append('group[id]', payload.group.id || '');
        formData.append('group[name]', payload.group.name || '');
        formData.append('group[path]', payload.group.path || '');
        if (payload.file) formData.append('file', payload.file);

        try {
            return await update(
                'users/administrators',
                { data: formData },
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
