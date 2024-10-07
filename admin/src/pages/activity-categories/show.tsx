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
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';

const ActivityCategoryShowAction = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton mutationMode="pessimistic" redirect="/activities/categories" />
    </TopToolbar>
);

const ActivityCategoryShow = () => {
    const translate = useTranslate();

    return (
        <>
            <ConfigPagesHeader />
            <Show actions={<ActivityCategoryShowAction />} title={translate('activity_categories.label')}>
                <SimpleShowLayout sx={{ m: 3 }}>
                    <TextField label={translate('activities_categories.show.name')} source="content.content" />

                    <ArrayField label={translate('global.translations')} source="content.translations">
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

export default ActivityCategoryShow;
