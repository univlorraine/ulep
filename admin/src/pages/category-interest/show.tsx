import React from 'react';
import { useRedirect } from 'react-admin';
import { DeleteButton } from 'react-admin';
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

const InterestCategoryShowAction = () => {
    const redirect = useRedirect();

    return (
        <TopToolbar>
            <EditButton />
            <DeleteButton redirect="/interests/categories" />
        </TopToolbar>
    );
};

const InterestCategoryShow = () => {
    const translate = useTranslate();

    return (
        <Show actions={<InterestCategoryShowAction />} title={translate('interest_categories.label')}>
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

export default InterestCategoryShow;
