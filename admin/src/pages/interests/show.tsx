import React from 'react';
import {
    DeleteButton,
    TopToolbar,
    EditButton,
    useTranslate,
    Show,
    SimpleShowLayout,
    TextField,
    ArrayField,
    Datagrid,
} from 'react-admin';

const InterestShowAction = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton redirect="/interests/categories" />
    </TopToolbar>
);

const InterestShow = () => {
    const translate = useTranslate();

    return (
        <Show actions={<InterestShowAction />} title={translate('interests.label')}>
            <SimpleShowLayout>
                <TextField label={translate('interests.show.name')} source="name.content" />

                <ArrayField label={translate('global.translations')} source="name.translations">
                    <Datagrid bulkActionButtons={false}>
                        <TextField label="Code" source="language" />
                        <TextField label="Contenu" source="content" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    );
};

export default InterestShow;
