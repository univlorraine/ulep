import { Edit, useNotify, useRedirect, useTranslate, useUpdate, WithRecord } from 'react-admin';
import InstanceForm from '../../components/form/InstanceForm';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import Instance, { InstanceFormPayload } from '../../entities/Instance';

const EditInstance = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (payload: InstanceFormPayload) => {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('email', payload.email);
        formData.append('ressourceUrl', payload.ressourceUrl);
        formData.append('cguUrl', payload.cguUrl);
        formData.append('confidentialityUrl', payload.confidentialityUrl);
        formData.append('primaryColor', payload.primaryColor);
        formData.append('primaryBackgroundColor', payload.primaryBackgroundColor);
        formData.append('primaryDarkColor', payload.primaryDarkColor);
        formData.append('secondaryColor', payload.secondaryColor);
        formData.append('secondaryBackgroundColor', payload.secondaryBackgroundColor);
        formData.append('secondaryDarkColor', payload.secondaryDarkColor);
        formData.append('daysBeforeClosureNotification', payload.daysBeforeClosureNotification.toString());
        payload.editoMandatoryTranslations.forEach((translation, index) => {
            formData.append(`editoMandatoryTranslations[${index}]`, translation);
        });

        if (payload.defaultCertificateFile) {
            formData.append('defaultCertificateFile', payload.defaultCertificateFile);
        }

        try {
            return await update(
                'instance',
                { data: formData },
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
