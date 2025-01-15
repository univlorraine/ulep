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

const ActivityThemeShowAction = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton mutationMode="pessimistic" redirect="/activities/themes" />
    </TopToolbar>
);

const ActivityThemeShow = () => {
    const translate = useTranslate();

    return (
        <>
            <ConfigPagesHeader />
            <Show actions={<ActivityThemeShowAction />}>
                <SimpleShowLayout sx={{ m: 3 }}>
                    <TextField label={translate('activities_categories.name')} source="content.content" />

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

export default ActivityThemeShow;
