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

const ReportCategoryShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const ReportCategoryShow = () => {
    const translate = useTranslate();

    return (
        <Show actions={<ReportCategoryShowAction />} title={translate('report_categories.label')}>
            <SimpleShowLayout sx={{ m: 3 }}>
                <TextField label={translate('report_categories.show.name')} source="name.content" />
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

export default ReportCategoryShow;
