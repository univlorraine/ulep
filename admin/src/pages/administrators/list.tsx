/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
        (record?.universityId !== identity.universityId || record?.group?.name === AdminGroup.SUPER_ADMIN)
    ) {
        return null;
    }

    const disconnect = () => {
        window.setTimeout(logout, 600);
    };

    if (record?.id === identity.id) {
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
            confirmTitle={translate('administrators.delete.title', {
                name: `${record?.firstname} ${record?.lastname}`,
            })}
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
                            admin.group?.name
                                ? translate(`admin_groups_picker.${admin.group.name.toLowerCase()}`)
                                : translate('global.loading')
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
