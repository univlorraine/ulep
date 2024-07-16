import { Select, MenuItem } from '@mui/material';
import React, { useMemo } from 'react';
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
import User from '../../entities/User';

export interface ProfileFilterProps {
    displayAllUniversities: boolean;
}

const ProfileFilter = ({ displayAllUniversities, ...props }: ProfileFilterProps) => {
    const translate = useTranslate();

    const { data: languages } = useGetList('languages', {
        pagination: { page: 1, perPage: 250 },
        sort: { field: 'name', order: 'ASC' },
    });

    const sortedLanguages = useMemo(() => {
        if (!languages) return [];

        return languages.sort((a, b) => {
            const nameA = translate(`languages_code.${a.code}`);
            const nameB = translate(`languages_code.${b.code}`);

            return nameA.localeCompare(nameB);
        });
    }, [languages]);

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
                    optionText={(option) => translate(`languages_code.${option.code}`)}
                    optionValue="code"
                    source="nativeLanguageCode"
                />
            )}
            {sortedLanguages && (
                <SelectInput
                    choices={sortedLanguages}
                    label={translate('profiles.mastered_languages')}
                    optionText={(option) => translate(`languages_code.${option.code}`)}
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
                choices={[
                    { id: 'STUDENT', name: translate('global.student') },
                    { id: 'STAFF', name: translate('global.staff') },
                ]}
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

    const onUpdateUserStatus = async (id: string, status: UserStatus) => {
        await update(
            'users',
            { id, data: { status } },
            {
                onSettled: (_, error: unknown) => {
                    if (!error) {
                        notify('profiles.edit_status_success');
                    } else {
                        notify('profiles.edit_status_error');
                    }

                    return refresh();
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
                        source="nativeLanguageCode"
                    />
                    <ArrayField
                        label={translate('profiles.mastered_languages')}
                        sortable={false}
                        source="masteredLanguages"
                    >
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
