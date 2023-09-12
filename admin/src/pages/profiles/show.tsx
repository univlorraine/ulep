import React from 'react';
import {
    TabbedShowLayout,
    FunctionField,
    useTranslate,
    ArrayField,
    SingleFieldList,
    ChipField,
    TextField,
    Show,
    useRecordContext,
    Datagrid,
} from 'react-admin';
import User from '../../entities/User';

const Title = () => {
    const record = useRecordContext();

    if (!record) {
        return null;
    }

    return (
        <span>
            {record.firstname} {record.lastname}
        </span>
    );
};

const ProfileShow = (props: any) => {
    const translate = useTranslate();

    return (
        <Show title={<Title />} {...props}>
            <TabbedShowLayout>
                <TabbedShowLayout.Tab
                    contentClassName="tab"
                    label={translate('profiles.summary')}
                    sx={{
                        '& .RaTabbedShowLayout-content': {
                            margin: 3,
                        },
                    }}
                >
                    <TextField label={translate('global.email')} source="user.email" />
                    <TextField label={translate('global.firstname')} source="user.firstname" />
                    <TextField label={translate('global.lastname')} source="user.lastname" />
                    <TextField label={translate('global.age')} source="user.age" />
                    <TextField label={translate('global.gender')} source="user.gender" />
                    <TextField label={translate('global.university')} source="user.university.name" />
                    <FunctionField
                        label={translate('global.role')}
                        render={(record: { user: User }) => translate(`global.${record.user.role.toLowerCase()}`)}
                        source="user.role"
                    />
                    <ArrayField label={translate('profiles.objectives')} source="objectives">
                        <SingleFieldList linkType={false}>
                            <ChipField clickable={false} source="name" />
                        </SingleFieldList>
                    </ArrayField>
                    <FunctionField
                        label={translate('profiles.frequency')}
                        render={(record: { meetingFrequency: MeetFrequency }) =>
                            translate(`profiles.frequencies.${record.meetingFrequency}`)
                        }
                        source="meetingFrequency"
                    />
                    <ArrayField label={translate('profiles.interests')} sortable={false} source="interests">
                        <SingleFieldList linkType={false}>
                            <ChipField clickable={false} source="name" />
                        </SingleFieldList>
                    </ArrayField>
                </TabbedShowLayout.Tab>

                <TabbedShowLayout.Tab contentClassName="tab" label={translate('profiles.language_title')}>
                    <TextField label={translate('profiles.native_language')} source="nativeLanguage.name" />
                    <ArrayField
                        label={translate('profiles.mastered_languages')}
                        sortable={false}
                        source="masteredLanguages"
                    >
                        <SingleFieldList linkType={false}>
                            <ChipField source="name" />
                        </SingleFieldList>
                    </ArrayField>
                    <ArrayField source="learningLanguages">
                        <Datagrid bulkActionButtons={false}>
                            <TextField source="name" />
                            <TextField source="level" />
                        </Datagrid>
                    </ArrayField>
                </TabbedShowLayout.Tab>

                <TabbedShowLayout.Tab contentClassName="tab" label={translate('profiles.biography.title')}>
                    <TextField label={translate('profiles.biography.superpower')} source="biography.superpower" />
                    <TextField
                        label={translate('profiles.biography.favorite_place')}
                        source="biography.favoritePlace"
                    />
                    <TextField label={translate('profiles.biography.experience')} source="biography.experience" />
                    <TextField label={translate('profiles.biography.anecdote')} source="biography.anecdote" />
                </TabbedShowLayout.Tab>
            </TabbedShowLayout>
        </Show>
    );
};

export default ProfileShow;
