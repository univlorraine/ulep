import { Create, useTranslate } from 'react-admin';
import NewsForm from '../../components/form/NewsForm';
import PageTitle from '../../components/PageTitle';

const CreateNews = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('news.title')}</PageTitle>
            <Create>
                <NewsForm handleSubmit={() => {}} />
            </Create>
        </>
    );
};
export default CreateNews;
