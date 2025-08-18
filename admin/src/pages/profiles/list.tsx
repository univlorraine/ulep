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

import { Select, MenuItem } from '@mui/material';
import React from 'react';
import {
    useRefresh,
    useNotify,
    useGetList,
    useUpdate,
    BooleanField,
    SelectInput,
    ReferenceInput,
    Filter,
    TextInput,
    SingleFieldList,
    ArrayField,
    Datagrid,
    List,
    TextField,
    useTranslate,
    FunctionField,
    ChipField,
    useGetIdentity,
    Loading,
    usePermissions,
} from 'react-admin';
import PageTitle from '../../components/PageTitle';
import { Role } from '../../entities/Administrator';
import Language from '../../entities/Language';
import { Profile } from '../../entities/Profile';
import User, { UserRole, UserStatus } from '../../entities/User';
import useGetSortedLanguagesWithLabel from '../../utils/useGetSortedLanguagesWithLabel';

export interface ProfileFilterProps {
    displayAllUniversities: boolean;
}

const ProfileFilter = ({ displayAllUniversities, ...props }: ProfileFilterProps) => {
    const translate = useTranslate();

    const { data: languages } = useGetList('languages', {
        pagination: { page: 1, perPage: 250 },
    });

    const sortedLanguages = useGetSortedLanguagesWithLabel(languages);

    return (
        <Filter {...props}>
            <TextInput label={translate('global.firstname')} source="user.firstname" />
            <TextInput label={translate('global.lastname')} source="user.lastname" />
            <TextInput label={translate('global.email')} source="user.email" />
            <ReferenceInput label={translate('profiles.country')} reference="countries" source="user.country">
                <SelectInput label={translate('profiles.country')} optionText="name" optionValue="code" />
            </ReferenceInput>
            {displayAllUniversities && (
                <ReferenceInput
                    label={translate('global.university')}
                    reference="universities"
                    source="user.university"
                >
                    <SelectInput label={translate('global.university')} optionText="name" optionValue="id" />
                </ReferenceInput>
            )}
            {sortedLanguages && (
                <SelectInput
                    choices={sortedLanguages}
                    label={translate('profiles.native_language')}
                    optionText={(option) => option.label}
                    optionValue="code"
                    source="nativeLanguageCode"
                />
            )}
            {sortedLanguages && (
                <SelectInput
                    choices={sortedLanguages}
                    label={translate('profiles.mastered_languages')}
                    optionText={(option) => option.label}
                    optionValue="code"
                    source="masteredLanguageCode"
                />
            )}
            <SelectInput
                choices={[
                    { id: 'ACTIVE', name: translate('global.userStatus.active') },
                    { id: 'REPORTED', name: translate('global.userStatus.reported') },
                    { id: 'BANNED', name: translate('global.userStatus.banned') },
                    { id: 'CANCELED', name: translate('global.userStatus.canceled') },
                ]}
                label={translate('profiles.status')}
                source="user.status"
            />
            <SelectInput
                key="role"
                choices={Object.values(UserRole).map((role) => ({
                    id: role,
                    name: translate(`global.${role.toLowerCase()}`),
                }))}
                label={translate('global.role')}
                source="user.role"
            />
        </Filter>
    );
};

const ProfileList = (props: any) => {
    const { permissions } = usePermissions();
    const translate = useTranslate();

    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    const [update] = useUpdate();
    const refresh = useRefresh();
    const notify = useNotify();

    const onUpdateUserStatus = async (id: string, status: UserStatus | undefined) => {
        await update(
            'users',
            { id, data: { status } },
            {
                onSuccess: () => {
                    notify('profiles.edit_status_success');
                    refresh();
                },
                onError: (error) => {
                    console.error(error);
                    notify('profiles.edit_status_error', {
                        type: 'error',
                    });
                },
            }
        );
    };

    if (isLoadingIdentity) {
        return <Loading />;
    }

    const readOnly: boolean = permissions.checkRole(Role.ANIMATOR);
    const displayAllUniversities = Boolean(identity?.isCentralUniversity && permissions.checkRole(Role.SUPER_ADMIN));

    return (
        <>
            <PageTitle>{translate('profiles.title')}</PageTitle>
            <List
                exporter={false}
                filter={{
                    university: !displayAllUniversities ? identity?.universityId : undefined,
                }}
                filters={<ProfileFilter displayAllUniversities={displayAllUniversities} />}
                title={translate('profiles.label')}
                readOnly
                {...props}
            >
                <Datagrid
                    bulkActionButtons={readOnly ? false : undefined}
                    rowClick="show"
                    sx={{ paddingTop: '20px' }}
                    aria-readonly
                >
                    <FunctionField
                        label={translate('global.role')}
                        render={(record: { user: User }) => translate(`global.${record.user.role.toLowerCase()}`)}
                        source="user.role"
                    />
                    <TextField label={translate('global.lastname')} source="user.lastname" sortable />
                    <TextField label={translate('global.firstname')} source="user.firstname" sortable />
                    <TextField label={translate('global.email')} source="user.email" sortable />
                    <TextField label={translate('global.university')} sortable={false} source="user.university.name" />
                    <FunctionField
                        label={translate('profiles.native_language')}
                        render={(profile: Profile) => translate(`languages_code.${profile.nativeLanguage.code}`)}
                        sortable={false}
                        source="nativeLanguage.code"
                    />
                    <ArrayField
                        label={translate('profiles.mastered_languages')}
                        sortable={false}
                        source="masteredLanguages"
                    >
                        {/* @ts-ignore */}
                        <SingleFieldList linkType={false}>
                            <FunctionField
                                render={(record: Language) => (
                                    <ChipField
                                        record={{ name: translate(`languages_code.${record.code}`) }}
                                        source="name"
                                    />
                                )}
                            />
                        </SingleFieldList>
                    </ArrayField>
                    <BooleanField
                        label={translate('profiles.certificate')}
                        sortable={false}
                        source="certificateOption"
                    />
                    <FunctionField
                        label={translate('profiles.status')}
                        render={(record: { user: User }) =>
                            readOnly ? (
                                translate(`global.userStatus.${(record.user.status ?? 'ACTIVE').toLowerCase()}`)
                            ) : (
                                <Select
                                    onChange={(value) =>
                                        onUpdateUserStatus(record.user.id, value.target.value as UserStatus)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    size="small"
                                    value={record.user.status ?? 'ACTIVE'}
                                >
                                    <MenuItem value="ACTIVE">{translate('global.userStatus.active')}</MenuItem>
                                    <MenuItem value="REPORTED">{translate('global.userStatus.reported')}</MenuItem>
                                    <MenuItem value="BANNED">{translate('global.userStatus.banned')}</MenuItem>
                                    <MenuItem value="CANCELED">{translate('global.userStatus.canceled')}</MenuItem>
                                </Select>
                            )
                        }
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default ProfileList;
