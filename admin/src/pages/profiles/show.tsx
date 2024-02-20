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
    Identifier,
} from 'react-admin';
import Availabilites from '../../entities/Availabilities';
import Language from '../../entities/Language';
import { LearningLanguage } from '../../entities/LearningLanguage';
import { Profile } from '../../entities/Profile';
import User from '../../entities/User';

const Title = () => {
    const record = useRecordContext();

    if (!record?.user) {
        return null;
    }

    return (
        <span>
            {record.user.firstname} {record.user.lastname}
        </span>
    );
};

const ProfileTab = () => {
    const translate = useTranslate();
    const recordContext = useRecordContext();

    return (
        <TabbedShowLayout syncWithLocation={false}>
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
                    label={translate('learning_languages.show.fields.status')}
                    render={(record: { user: User }) =>
                        translate(`global.userStatus.${record.user.status?.toLowerCase()}`)
                    }
                />
                <FunctionField
                    label={translate('global.role')}
                    render={(record: { user: User }) => translate(`global.${record.user.role.toLowerCase()}`)}
                    source="user.role"
                />
                {recordContext?.user?.division && (
                    <TextField label={translate('profiles.division')} source="user.division" />
                )}
                {recordContext?.user?.role === 'STUDENT' && recordContext?.user?.diploma && (
                    <TextField label={translate('profiles.diploma')} source="user.diploma" />
                )}
                {recordContext?.user?.role === 'STAFF' && recordContext?.user?.staffFunction && (
                    <TextField label={translate('profiles.staffFunction')} source="user.staffFunction" />
                )}
                <TextField label={translate('global.university')} source="user.university.name" />
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
                <FunctionField
                    label={translate('profiles.native_language')}
                    render={(record: Profile) => translate(`languages_code.${record.nativeLanguage.code}`)}
                />
                <ArrayField
                    label={translate('profiles.mastered_languages')}
                    sortable={false}
                    source="masteredLanguages"
                >
                    <SingleFieldList>
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
                <ArrayField source="learningLanguages">
                    <Datagrid bulkActionButtons={false} rowClick={(id: Identifier) => `/learning-languages/${id}/show`}>
                        <FunctionField
                            render={(record: LearningLanguage) => translate(`languages_code.${record.code}`)}
                            source="name"
                        />
                        <TextField source="level" />
                    </Datagrid>
                </ArrayField>
            </TabbedShowLayout.Tab>

            <TabbedShowLayout.Tab contentClassName="tab" label={translate('profiles.biography.title')}>
                <TextField label={translate('profiles.biography.superpower')} source="biography.superpower" />
                <TextField label={translate('profiles.biography.favorite_place')} source="biography.favoritePlace" />
                <TextField label={translate('profiles.biography.experience')} source="biography.experience" />
                <TextField label={translate('profiles.biography.anecdote')} source="biography.anecdote" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab contentClassName="tab" label={translate('profiles.availabilities')}>
                <FunctionField
                    label={translate('days.monday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.monday}`)
                    }
                    source="availabilities.monday"
                />
                <FunctionField
                    label={translate('days.tuesday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.tuesday}`)
                    }
                    source="availabilities.tuesday"
                />
                <FunctionField
                    label={translate('days.wednesday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.wednesday}`)
                    }
                    source="availabilities.wednesday"
                />
                <FunctionField
                    label={translate('days.thursday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.thursday}`)
                    }
                    source="availabilities.thursday"
                />
                <FunctionField
                    label={translate('days.friday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.friday}`)
                    }
                    source="availabilities.friday"
                />
                <FunctionField
                    label={translate('days.saturday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.saturday}`)
                    }
                    source="availabilities.saturday"
                />
                <FunctionField
                    label={translate('days.sunday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.sunday}`)
                    }
                    source="availabilities.sunday"
                />
                <TextField label={translate('profiles.availabilities_note')} source="availabilitiesNote" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
};

const ProfileShow = (props: any) => (
    <Show title={<Title />} {...props}>
        <ProfileTab />
    </Show>
);

export default ProfileShow;
