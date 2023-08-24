import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';
import InterestForm from '../../components/form/InterestForm';
import { useLocation } from 'react-router-dom';

const CreateInterest = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();
    const { state } = useLocation();
    const category = state?.category;
    console.warn(category);

    const handleSubmit = async (name: string, translations: IndexedTranslation[]) => {
        const payload = {
            name,
            category,
            translations: indexedTranslationsToTranslations(translations),
        };
        try {
            const result = await create('interests', { data: payload });
            redirect('/interests/categories');

            return result;
        } catch (err) {
            console.error(err);

            return notify('interests.create.error');
        }
    };

    return (
        <Create title={translate('interests.create.title')}>
            <InterestForm handleSubmit={handleSubmit} />
        </Create>
    );
};

export default CreateInterest;
