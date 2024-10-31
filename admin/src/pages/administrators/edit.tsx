import { Edit, useNotify, useRedirect, useTranslate, useUpdate, WithRecord } from 'react-admin';
import AdministratorForm from '../../components/form/AdministratorForm';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import Administrator, { AdministratorFormPayload } from '../../entities/Administrator';

const EditAdministrator = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (payload: AdministratorFormPayload) => {
        const formData = new FormData();

        formData.append('id', payload.id || '');
        formData.append('email', payload.email || '');
        formData.append('firstname', payload.firstname || '');
        formData.append('lastname', payload.lastname || '');
        if (payload.password) formData.append('password', payload.password);
        formData.append('universityId', payload.universityId || '');
        formData.append('languageId', payload.languageId || '');
        formData.append('group[id]', payload.group.id || '');
        formData.append('group[name]', payload.group.name || '');
        formData.append('group[path]', payload.group.path || '');
        if (payload.file) formData.append('file', payload.file);

        try {
            return await update(
                'users/administrators',
                { data: formData },
                {
                    onSettled: (_, error: any) => {
                        if (!error) {
                            return redirect('/users/administrators');
                        }

                        if (error.message === 'Email is already used') {
                            return notify('administrators.update.error_mail', { type: 'error' });
                        }

                        if (error.message) {
                            return notify(error.message, { type: 'error' });
                        }

                        return notify('administrators.update.error', { type: 'error' });
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('administrators.update.error', { type: 'error' });
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
                            languageId={record.languageId}
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
