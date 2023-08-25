import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';
import InterestForm from '../../components/form/InterestForm';

const CreateInterestCategory = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (name: string, translations: IndexedTranslation[]) => {
        const payload = {
            name,
            translations: indexedTranslationsToTranslations(translations),
        };
        try {
            const result = await create('interests/categories', { data: payload });
            redirect('/interests/categories');

            return result;
        } catch (err) {
            console.error(err);

            return notify('interest_categories.create.error');
        }
    };

    return (
        <Create title={translate('interest_categories.create.title')}>
            <InterestForm handleSubmit={handleSubmit} tradKey="interest_categories" />
        </Create>
    );
};

export default CreateInterestCategory;
