import { Edit, useNotify, useRedirect, useRefresh, useTranslate, useUpdate } from 'react-admin';
import NewsForm from '../../components/form/NewsForm';
import PageTitle from '../../components/PageTitle';
import { NewsFormPayload } from '../../entities/News';

const EditNews = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleSubmit = async (payload: NewsFormPayload) => {
        if (!payload.id) {
            return notify('news.form.error.notFound', {
                type: 'error',
            });
        }

        if (!payload.title || !payload.content || !payload.startPublicationDate || !payload.endPublicationDate) {
            return notify('news.form.error.required', {
                type: 'error',
            });
        }

        const formData = new FormData();

        formData.append('id', payload.id);
        formData.append('title', payload.title);
        formData.append('content', payload.content);
        formData.append('languageCode', payload.languageCode);
        formData.append('status', payload.status);
        formData.append('universityId', payload.universityId);
        formData.append('startPublicationDate', payload.startPublicationDate.toISOString());
        formData.append('endPublicationDate', payload.endPublicationDate.toISOString());

        payload.translations.forEach((translation, index) => {
            formData.append(`translations[${index}][title]`, translation.title);
            formData.append(`translations[${index}][content]`, translation.content);
            formData.append(`translations[${index}][languageCode]`, translation.languageCode);
        });

        if (payload.image) formData.append('file', payload.image);

        try {
            return await update(
                'news',
                { data: formData },
                {
                    onSettled: (_, error: any) => {
                        if (!error) {
                            refresh();

                            return redirect('/news');
                        }

                        return notify('news.create.error', {
                            type: 'error',
                        });
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('news.create.error', {
                type: 'error',
            });
        }
    };

    return (
        <>
            <PageTitle>{translate('news.title')}</PageTitle>
            <Edit>
                <NewsForm handleSubmit={handleSubmit} />
            </Edit>
        </>
    );
};

export default EditNews;
