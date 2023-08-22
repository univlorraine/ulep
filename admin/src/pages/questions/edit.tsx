import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import QuestionForm from '../../components/form/QuestionForm';
import Question from '../../entities/Question';
import Translation from '../../entities/Translation';

const EditQuestion = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (
        id: string,
        newLevel: string,
        newQuestion: string,
        newTranslations: { index: number; item: Translation }[]
    ) => {
        const payload = {
            id,
            level: newLevel,
            value: newQuestion,
            translations: newTranslations
                .map((translation) => translation.item)
                .filter((translation) => translation.content && translation.language),
        };
        try {
            const result = await update('proficiency/questions', { data: payload });
            redirect('/proficiency/questions');

            return result;
        } catch (err) {
            console.error(err);

            return notify('questions.update.error');
        }
    };

    return (
        <Edit title={translate('questions.update.title')}>
            <WithRecord
                label="proficiency/questions"
                render={(record: Question) => (
                    <QuestionForm
                        handleSubmit={(
                            test: string,
                            name: string,
                            translations: { index: number; item: Translation; file?: File | undefined }[]
                        ) => handleSubmit(record.id, test, name, translations)}
                        level={record.level}
                        name={record.value.content}
                        tranlsations={record.value.translations?.map((translation: Translation, index: number) => ({
                            index,
                            item: translation,
                        }))}
                    />
                )}
            />
        </Edit>
    );
};

export default EditQuestion;
