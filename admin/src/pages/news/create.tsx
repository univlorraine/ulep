import { Create, useCreate, useNotify, useRedirect, useTranslate } from 'react-admin';
import NewsForm from '../../components/form/NewsForm';
import PageTitle from '../../components/PageTitle';
import { NewsFormPayload } from '../../entities/News';

const CreateNews = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (payload: NewsFormPayload) => {
        const formData = new FormData();

        formData.append('title', payload.title || '');
        formData.append('content', payload.content || '');
        formData.append('languageCode', payload.languageCode || '');
        formData.append('published', payload.published.toString() || 'false');
        formData.append('universityId', payload.universityId || '');
        formData.append('translations', JSON.stringify(payload.translations || []));
        /*         formData.append('group[id]', payload.group.id || '');
        formData.append('group[name]', payload.group.name || '');
        formData.append('group[path]', payload.group.path || ''); */
        if (payload.image) formData.append('image', payload.image);

        try {
            return await create(
                'news',
                { data: formData },
                {
                    onSettled: (_, error: any) => {
                        if (!error) {
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
            <Create>
                <NewsForm handleSubmit={handleSubmit} />
            </Create>
        </>
    );
};

export default CreateNews;
