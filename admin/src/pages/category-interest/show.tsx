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
import ConfigTabs from '../../components/tabs/ConfigTabs';

const InterestCategoryShowAction = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton redirect="/interests/categories" />
    </TopToolbar>
);

const InterestCategoryShow = () => {
    const translate = useTranslate();

    return (
        <>
            <ConfigTabs />
            <Show actions={<InterestCategoryShowAction />} title={translate('interest_categories.label')}>
                <SimpleShowLayout sx={{ m: 3 }}>
                    <TextField label={translate('interests.show.name')} source="name.content" />

                    <ArrayField label={translate('global.translations')} source="name.translations">
                        <Datagrid bulkActionButtons={false}>
                            <TextField label="Code" source="language" />
                            <TextField label="Contenu" source="content" />
                        </Datagrid>
                    </ArrayField>
                </SimpleShowLayout>
            </Show>
        </>
    );
};

export default InterestCategoryShow;
