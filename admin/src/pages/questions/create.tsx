import React from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import QuestionForm from '../../components/form/QuestionForm';
import IndexedTranslation from '../../entities/IndexedTranslation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const CreateQuestion = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (level: string, question: string, translations: IndexedTranslation[]) => {
        const payload = {
            level,
            value: question,
            translations: indexedTranslationsToTranslations(translations),
        };
        try {
            return await create(
                'proficiency/questions',
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/proficiency/questions');
                        }

                        return notify('questions.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('questions.create.error');
        }
    };

    return (
        <Create title={translate('objectives.create.title')}>
            <QuestionForm handleSubmit={handleSubmit} />
        </Create>
    );
};

export default CreateQuestion;
