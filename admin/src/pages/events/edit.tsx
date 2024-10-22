import { Edit, useNotify, useRedirect, useTranslate, useUpdate } from 'react-admin';
import EventForm from '../../components/form/EventForm';
import PageTitle from '../../components/PageTitle';
import { EventFormPayload, EventType } from '../../entities/Event';

const EditEvent = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (payload: EventFormPayload) => {
        if (
            !payload.id ||
            !payload.title ||
            !payload.content ||
            !payload.startDate ||
            !payload.endDate ||
            payload.diffusionLanguages?.length === 0 ||
            payload.concernedUniversities?.length === 0 ||
            (payload.type === EventType.ONLINE && !payload.eventURL) ||
            (payload.type === EventType.PRESENTIAL && (!payload.address || !payload.addressName))
        ) {
            return notify('events.form.error.required', {
                type: 'error',
            });
        }

        const formData = new FormData();

        formData.append('title', payload.title);
        formData.append('content', payload.content);
        formData.append('languageCode', payload.languageCode);
        formData.append('authorUniversityId', payload.authorUniversityId);
        formData.append('withSubscription', payload.withSubscription.toString());
        formData.append('status', payload.status);
        formData.append('type', payload.type);
        formData.append('startDate', payload.startDate.toISOString());
        formData.append('endDate', payload.endDate.toISOString());

        payload.translations.forEach((translation, index) => {
            formData.append(`translations[${index}][title]`, translation.title);
            formData.append(`translations[${index}][content]`, translation.content);
            formData.append(`translations[${index}][languageCode]`, translation.languageCode);
        });

        payload.diffusionLanguages?.forEach((language, index) => {
            formData.append(`diffusionLanguages[${index}]`, language);
        });

        payload.concernedUniversities?.forEach((university, index) => {
            formData.append(`concernedUniversities[${index}]`, university.id);
        });

        if (payload.eventURL) formData.append('eventUrl', payload.eventURL);
        if (payload.address) formData.append('address', payload.address);
        if (payload.addressName) formData.append('addressName', payload.addressName);
        if (payload.image) formData.append('file', payload.image);
        if (payload.imageCredit) formData.append('imageCredit', payload.imageCredit);

        try {
            return await update(
                'events',
                { id: payload.id, data: formData },
                {
                    onSettled: (_, error: any) => {
                        if (!error) {
                            return redirect('/events');
                        }

                        return notify('events.update.error', {
                            type: 'error',
                        });
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('events.update.error', {
                type: 'error',
            });
        }
    };

    return (
        <>
            <PageTitle>{translate('events.title')}</PageTitle>
            <Edit>
                <EventForm handleSubmit={handleSubmit} />
            </Edit>
        </>
    );
};

export default EditEvent;
