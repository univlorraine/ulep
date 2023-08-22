import React from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import QuestionForm from '../../components/form/QuestionForm';
import Translation from '../../entities/Translation';

const CreateQuestion = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (
        level: string,
        question: string,
        translations: { index: number; item: Translation }[]
    ) => {
        const payload = {
            level,
            value: question,
            translations: translations
                .map((translation) => translation.item)
                .filter((translation) => translation.content && translation.language),
        };
        try {
            const result = await create('proficiency/questions', { data: payload });
            redirect('/proficiency/questions');

            return result;
        } catch (err) {
            console.error(err);

            return notify('report_categories.create.error');
        }
    };

    return (
        <Create title={translate('objectives.create.title')}>
            <QuestionForm handleSubmit={handleSubmit} />
        </Create>
    );
};

export default CreateQuestion;
