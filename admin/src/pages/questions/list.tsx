import React from 'react';
import { ReferenceInput, useTranslate, Filter, SelectInput, List, Datagrid, TextField } from 'react-admin';
import PageTitle from '../../components/PageTitle';

const QuestionFilter = (props: any) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            <ReferenceInput label={translate('questions.level')} reference="proficiency/tests" source="level">
                <SelectInput label={translate('questions.level')} optionText="level" optionValue="level" />
            </ReferenceInput>
        </Filter>
    );
};

const QuestionList = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('questions.title')}</PageTitle>
            <List bulkActionButtons={false} exporter={false} filters={<QuestionFilter />}>
                <Datagrid rowClick="show">
                    <TextField label={translate('questions.level')} source="level" />
                    <TextField label={translate('questions.question')} source="value" />
                </Datagrid>
            </List>
        </>
    );
};

export default QuestionList;
