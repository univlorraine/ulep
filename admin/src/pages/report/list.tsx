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
} from 'react-admin';
import ReportsTabs from '../../components/tabs/ReportsTabs';

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
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <>
            <ReportsTabs />
            <List
                exporter={false}
                filter={!identity?.isCentralUniversity ? { universityId: identity.universityId } : undefined}
                filters={<ReportFilter />}
            >
                <Datagrid rowClick="show">
                    <TextField label={translate('reports.category')} source="category.name" />
                    <TextField label={translate('global.lastname')} source="user.lastname" />
                    <TextField label={translate('global.firstname')} source="user.firstname" />
                    <TextField label={translate('global.university')} source="user.university.name" />
                    <FunctionField
                        label={translate('reports.status')}
                        render={(record: any) => translate(`reports.${record.status}`)}
                        source="status"
                    />
                    <TextField label={translate('reports.content')} source="content" />
                    <DateField label={translate('reports.created_at')} source="createdAt" />
                </Datagrid>
            </List>
        </>
    );
};

export default ReportList;
