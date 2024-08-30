import { Create } from 'react-admin';
import NewsForm from '../../components/form/NewsForm';

const CreateNews = () => (
    <Create>
        <NewsForm handleSubmit={() => {}} />
    </Create>
);
export default CreateNews;
