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
} from 'react-admin';
import Language from '../../entities/Language';
import { Profile } from '../../entities/Profile';
import User from '../../entities/User';

const ProfileFilter = (props: any) => {
    const translate = useTranslate();

    const { data: identity } = useGetIdentity();

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
            {identity?.isCentralUniversity && (
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
                    { id: 'BANNED', name: translate('global.userStatus.blocked') },
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
    const translate = useTranslate();

    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    const [update] = useUpdate();
    const refresh = useRefresh();
    const notify = useNotify();

    const onUpdateUserStatus = async (id: string, status: UserStatus) => {
        const payload = { id, status };
        await update(
            'users',
            { data: payload },
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

    return (
        <List
            exporter={false}
            filter={{
                university: !identity?.isCentralUniversity ? identity?.universityId : undefined,
            }}
            filters={<ProfileFilter />}
            title={translate('profiles.label')}
            {...props}
        >
            <Datagrid rowClick="show">
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
                <BooleanField label={translate('profiles.certificate')} sortable={false} source="certificateOption" />
                <FunctionField
                    label={translate('profiles.status')}
                    render={(record: { user: User }) => (
                        <Select
                            onChange={(value) => onUpdateUserStatus(record.user.id, value.target.value as UserStatus)}
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                            value={record.user.status ?? 'ACTIVE'}
                        >
                            <MenuItem value="ACTIVE">{translate('global.active')}</MenuItem>
                            <MenuItem value="REPORTED">{translate('global.reported')}</MenuItem>
                            <MenuItem value="BANNED">{translate('global.blocked')}</MenuItem>
                            <MenuItem value="CANCELED">{translate('global.canceled')}</MenuItem>
                        </Select>
                    )}
                />
            </Datagrid>
        </List>
    );
};

export default ProfileList;
