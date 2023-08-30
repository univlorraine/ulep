import React from 'react';
import {
    useTranslate,
    SimpleShowLayout,
    ArrayField,
    SingleFieldList,
    ChipField,
    TextField,
    Show,
    useRecordContext,
} from 'react-admin';

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
            <SimpleShowLayout>
                <TextField label={translate('global.email')} source="user.email" />
                <TextField label={translate('global.firstname')} source="user.firstname" />
                <TextField label={translate('global.lastname')} source="user.lastname" />
                <TextField label={translate('global.age')} source="user.age" />
                <TextField label={translate('global.gender')} source="user.gender" />
                <TextField label={translate('global.university')} source="user.university.name" />
                <TextField label={translate('global.role')} source="user.role" />
                <TextField label={translate('profiles.objectives')} source="goals" />
                <TextField label={translate('profiles.native_language')} source="nativeLanguage.code" />
                <TextField label={translate('profiles.learning_language.code')} source="learningLanguages.code" />
                <TextField label={translate('profiles.learning_language.level')} source="learningLanguages.language" />
                <TextField label={translate('profiles.frequency')} source="meetingFrequency" />
                <ArrayField label={translate('profiles.interests')} sortable={false} source="interests">
                    <SingleFieldList linkType={false}>
                        <ChipField clickable={false} source="name" />
                    </SingleFieldList>
                </ArrayField>
                <TextField label={translate('profiles.biography.superpower')} source="biography.superpower" />
                <TextField label={translate('profiles.biography.favorite_place')} source="biography.favoritePlace" />
                <TextField label={translate('profiles.biography.experience')} source="biography.experience" />
                <TextField label={translate('profiles.biography.anecdote')} source="biography.anecdote" />
            </SimpleShowLayout>
        </Show>
    );
};

export default ProfileShow;
