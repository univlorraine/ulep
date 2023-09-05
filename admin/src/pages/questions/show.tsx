import React from 'react';
import {
    TopToolbar,
    EditButton,
    useTranslate,
    Show,
    SimpleShowLayout,
    TextField,
    ArrayField,
    Datagrid,
} from 'react-admin';

const QuestionShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const QuestionShow = () => {
    const translate = useTranslate();

    return (
        <Show actions={<QuestionShowAction />} title={translate('questions.label')}>
            <SimpleShowLayout sx={{ m: 3 }}>
                <TextField label={translate('questions.show.level')} source="level" />
                <TextField label={translate('questions.show.name')} source="value.content" />

                <ArrayField label={translate('global.translations')} source="value.translations">
                    <Datagrid bulkActionButtons={false}>
                        <TextField label="Code" source="language" />
                        <TextField label="Contenu" source="content" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    );
};

export default QuestionShow;
