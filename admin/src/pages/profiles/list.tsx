import { Select, MenuItem } from '@mui/material';
import React from 'react';
import {
    useRefresh,
    useNotify,
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
import User from '../../entities/User';

const ProfileFilter = (props: any) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            <TextInput label={translate('global.firstname')} source="user.firstname" />
            <TextInput label={translate('global.lastname')} source="user.lastname" />
            <TextInput label={translate('global.email')} source="user.email" />
            <ReferenceInput label={translate('profiles.country')} reference="countries" source="user.country">
                <SelectInput label={translate('profiles.country')} optionText="name" optionValue="code" />
            </ReferenceInput>
            <ReferenceInput
                label={translate('profiles.native_language')}
                perPage={250}
                reference="languages"
                source="nativeLanguageCode"
            >
                <SelectInput label={translate('profiles.native_language')} optionText="code" optionValue="code" />
            </ReferenceInput>
            <ReferenceInput
                label={translate('profiles.mastered_languages')}
                perPage={250}
                reference="languages"
                source="masteredLanguageCode"
            >
                <SelectInput label={translate('profiles.mastered_languages')} optionText="code" optionValue="code" />
            </ReferenceInput>
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
            filter={{ university: !identity?.isCentralUniversity ? identity?.universityId : undefined }}
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
                <TextField
                    label={translate('profiles.native_language')}
                    sortable={false}
                    source="nativeLanguage.name"
                />
                <ArrayField
                    label={translate('profiles.mastered_languages')}
                    sortable={false}
                    source="masteredLanguages"
                >
                    <SingleFieldList linkType={false}>
                        <ChipField source="name" />
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
                            <MenuItem value="BANNED">{translate('global.banned')}</MenuItem>
                        </Select>
                    )}
                />
            </Datagrid>
        </List>
    );
};

export default ProfileList;
