import { Edit, useNotify, useRefresh, useTranslate, useUpdate, WithRecord } from 'react-admin';
import EditoForm from '../../../components/form/EditoForm';
import PageTitle from '../../../components/PageTitle';
import { Edito, EditoFormPayload } from '../../../entities/Edito';

const EditEvent = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleSubmit = async (payload: EditoFormPayload) => {
        const formData = new FormData();

        formData.append('content', payload.content);
        formData.append('languageCode', payload.languageCode);

        payload.translations.forEach((translation, index) => {
            formData.append(`translations[${index}][content]`, translation.content);
            formData.append(`translations[${index}][languageCode]`, translation.languageCode);
        });

        if (payload.image) formData.append('file', payload.image);

        try {
            return await update(
                'editos',
                { id: payload.id, data: formData },
                {
                    onSettled: (_, error: any) => {
                        if (!error) {
                            return refresh();
                        }

                        return notify('editos.update.error', {
                            type: 'error',
                        });
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('editos.update.error', {
                type: 'error',
            });
        }
    };

    return (
        <>
            <PageTitle>{translate('editos.title')}</PageTitle>
            <Edit>
                <WithRecord<Edito>
                    label="editos"
                    render={(record) => <EditoForm handleSubmit={handleSubmit} record={record} />}
                />
            </Edit>
        </>
    );
};

export default EditEvent;
