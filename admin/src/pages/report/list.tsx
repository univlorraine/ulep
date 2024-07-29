import React from 'react';
import {
    FunctionField,
    useTranslate,
    Filter,
    SelectInput,
    Datagrid,
    List,
    TextField,
    DateField,
    Loading,
    useGetIdentity,
    usePermissions,
} from 'react-admin';
import ReportsPagesHeader from '../../components/tabs/ReportsPagesHeader';
import { Role } from '../../entities/Administrator';

const ReportFilter = (props: any) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            <SelectInput
                choices={[
                    { id: 'OPEN', name: translate('reports.OPEN') },
                    { id: 'IN_PROGRESS', name: translate('reports.IN_PROGRESS') },
                    { id: 'CLOSED', name: translate('reports.CLOSED') },
                ]}
                label={translate('reports.status')}
                source="status"
            />
        </Filter>
    );
};

const ReportList = () => {
    const { permissions } = usePermissions();
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    const readOnly: boolean = permissions.checkRole(Role.ANIMATOR);

    return (
        <>
            <ReportsPagesHeader />
            <List
                exporter={false}
                filter={!identity?.isCentralUniversity ? { universityId: identity.universityId } : undefined}
                filters={<ReportFilter />}
            >
                <Datagrid bulkActionButtons={readOnly ? false : undefined} rowClick="show">
                    <TextField label={translate('reports.category')} source="category.name" />
                    <TextField label={translate('global.lastname')} source="user.lastname" />
                    <TextField label={translate('global.firstname')} source="user.firstname" />
                    <TextField label={translate('global.university')} source="user.university.name" />
                    <FunctionField
                        label={translate('reports.status')}
                        render={(record: any) => translate(`reports.${record.status}`)}
                    />
                    <TextField label={translate('reports.content')} sortable={false} source="content" />
                    <DateField label={translate('reports.created_at')} source="createdAt" />
                </Datagrid>
            </List>
        </>
    );
};

export default ReportList;
