import React from 'react';
import {
    Datagrid,
    List,
    Loading,
    ReferenceField,
    TextField,
    useGetIdentity,
    useTranslate,
    useRecordContext,
    UserIdentity,
    DeleteButton,
    useLogout,
    ListProps,
    FunctionField,
} from 'react-admin';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import Administrator from '../../entities/Administrator';

interface DeleteAdministratorButtonProps {
    identity: UserIdentity;
}

const DeleteAdministratorButton = ({ identity }: DeleteAdministratorButtonProps) => {
    const record = useRecordContext();
    const logout = useLogout();
    const translate = useTranslate();

    const disconnect = () => {
        window.setTimeout(logout, 600);
    };

    if (record.id === identity.id) {
        return (
            <DeleteButton
                confirmContent={translate('administrators.confirmDeleteOwnAccount')}
                mutationMode="pessimistic"
                onClick={disconnect}
            />
        );
    }

    return <DeleteButton mutationMode="pessimistic" />;
};

const AdministratorList = (props: ListProps<Administrator>) => {
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <>
            <ConfigPagesHeader />
            <List
                exporter={false}
                filter={!identity?.isCentralUniversity ? { universityId: identity.universityId } : undefined}
                pagination={false}
                title={translate('administrators.label')}
                {...props}
            >
                <Datagrid bulkActionButtons={false} rowClick="edit">
                    <TextField label={translate('global.email')} sortable={false} source="email" />
                    <TextField label={translate('global.firstname')} sortable={false} source="firstname" />
                    <TextField label={translate('global.lastname')} sortable={false} source="lastname" />
                    <FunctionField
                        label={translate('global.group')}
                        render={(admin: Administrator) =>
                            translate(`admin_groups_picker.${admin.group.name.toLowerCase()}`)
                        }
                        sortable={false}
                    />

                    {identity.isCentralUniversity && (
                        <ReferenceField
                            emptyText={translate('administrators.all')}
                            label={translate('administrators.university')}
                            reference="universities"
                            sortable={false}
                            source="universityId"
                        />
                    )}
                    <DeleteAdministratorButton identity={identity} />
                </Datagrid>
            </List>
        </>
    );
};

export default AdministratorList;
