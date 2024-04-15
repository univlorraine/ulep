import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import QuestionForm from '../../components/form/QuestionForm';
import PageTitle from '../../components/PageTitle';
import IndexedTranslation from '../../entities/IndexedTranslation';
import Question from '../../entities/Question';
import Translation from '../../entities/Translation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const EditQuestion = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (
        id: string,
        newLevel: string,
        newQuestion: string,
        newTranslations: IndexedTranslation[]
    ) => {
        const payload = {
            id,
            level: newLevel,
            value: newQuestion,
            translations: indexedTranslationsToTranslations(newTranslations),
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
        <>
            <PageTitle>{translate('questions.title')}</PageTitle>
            <Edit title={translate('questions.update.title')}>
                <WithRecord<Question>
                    label="proficiency/questions"
                    render={(record) => (
                        <QuestionForm
                            handleSubmit={(level: string, name: string, translations: IndexedTranslation[]) =>
                                handleSubmit(record.id, level, name, translations)
                            }
                            level={record.level}
                            name={record.value.content}
                            translations={record.value.translations?.map(
                                (translation: Translation, index: number) => new IndexedTranslation(index, translation)
                            )}
                        />
                    )}
                />
            </Edit>
        </>
    );
};

export default EditQuestion;
