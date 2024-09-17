import {
    ArrayField,
    Datagrid,
    EditButton,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useTranslate,
} from 'react-admin';
import ReferenceUploadField from '../../components/field/ReferenceUploadImageField';
import PageTitle from '../../components/PageTitle';

const ObjectiveShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const ObjectiveShow = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('objectives.title')}</PageTitle>
            <Show actions={<ObjectiveShowAction />} title={translate('objectives.label')}>
                <SimpleShowLayout sx={{ m: 3 }}>
                    <TextField label={translate('objectives.name')} source="name.content" />

                    <ReferenceUploadField label={translate('global.image')} source="image.id" />

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

export default ObjectiveShow;
