import {
    Datagrid,
    DeleteWithConfirmButton,
    FunctionField,
    List,
    ListProps,
    Loading,
    ReferenceField,
    SelectInput,
    TextField,
    TextInput,
    useGetIdentity,
    useGetList,
    useLogout,
    usePermissions,
    useRecordContext,
    UserIdentity,
    useTranslate,
} from 'react-admin';
import useGetAdminGroups from '../../components/adminGroups/useGetAdminGroups';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import Administrator, { AdminGroup, Role } from '../../entities/Administrator';
import University, { isCentralUniversity } from '../../entities/University';

interface DeleteAdministratorButtonProps {
    identity: UserIdentity;
}

const DeleteAdministratorButton = ({ identity }: DeleteAdministratorButtonProps) => {
    const record = useRecordContext();
    const { permissions } = usePermissions();
    const logout = useLogout();
    const translate = useTranslate();

    if (
        !permissions.checkRole(Role.SUPER_ADMIN) &&
        (record.universityId !== identity.universityId || record.group.name === AdminGroup.SUPER_ADMIN)
    ) {
        return null;
    }

    const disconnect = () => {
        window.setTimeout(logout, 600);
    };

    if (record.id === identity.id) {
        return (
            <DeleteWithConfirmButton
                confirmContent={translate('administrators.delete.confirmDeleteOwnAccount')}
                confirmTitle={translate('administrators.delete.title', {
                    name: `${record.firstname} ${record.lastname}`,
                })}
                mutationMode="pessimistic"
                onClick={disconnect}
            />
        );
    }

    return (
        <DeleteWithConfirmButton
            confirmContent={translate('administrators.delete.confirmDeleteAccount')}
            confirmTitle={translate('administrators.delete.title', { name: `${record.firstname} ${record.lastname}` })}
            mutationMode="pessimistic"
        />
    );
};

const AdministratorList = (props: ListProps<Administrator>) => {
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { data: universities } = useGetList<University>('universities', {
        sort: {
            field: 'name',
            order: 'ASC',
        },
    });
    const adminGroups = useGetAdminGroups();
    const centralUniversity = universities?.find(isCentralUniversity);

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }
    const filtersBlock = [
        <SelectInput
            key="groupFilter"
            choices={adminGroups}
            label={translate('administrators.list.filters.group')}
            source="groupId"
            alwaysOn
        />,
        <TextInput
            key="userLastname"
            label={translate('administrators.list.filters.user_lastname')}
            source="lastname"
            alwaysOn
        />,
        <TextInput
            key="userFirstname"
            label={translate('administrators.list.filters.user_firstname')}
            source="firstname"
            alwaysOn
        />,
        <TextInput
            key="userEmail"
            label={translate('administrators.list.filters.user_email')}
            source="email"
            alwaysOn
        />,
    ];

    if (identity?.isCentralUniversity) {
        filtersBlock.unshift(
            <SelectInput
                key="universityFilter"
                choices={universities}
                label={translate('administrators.list.filters.university')}
                source="universityId"
                alwaysOn
            />
        );
    }

    const filters = universities && adminGroups ? filtersBlock : [];

    return (
        <>
            <ConfigPagesHeader />
            <List
                exporter={false}
                filter={!identity?.isCentralUniversity ? { universityId: identity.universityId } : undefined}
                pagination={false}
                title={translate('administrators.label')}
                {...props}
                filters={filters}
            >
                <Datagrid bulkActionButtons={false} rowClick="show">
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
                            emptyText={centralUniversity?.name}
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
