import { Create, useCreate, useNotify, useRedirect, useTranslate } from 'react-admin';
import AdministratorForm from '../../components/form/AdministratorForm';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import { AdministratorFormPayload } from '../../entities/Administrator';

const CreateAdministrator = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (payload: AdministratorFormPayload) => {
        const formData = new FormData();

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
            return await create(
                'users/administrators',
                { data: formData },
                {
                    onSettled: (_, error: any) => {
                        if (!error) {
                            return redirect('/users/administrators');
                        }

                        if (error.message === 'User is already an administrator') {
                            return notify('administrators.create.error_already_admin', { type: 'error' });
                        }

                        if (error.message === 'email must be an email') {
                            return notify('administrators.create.error_email', { type: 'error' });
                        }

                        if (error.message) {
                            return notify(error.message, { type: 'error' });
                        }

                        return notify('administrators.create.error', { type: 'error' });
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('administrators.create.error', { type: 'error' });
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
