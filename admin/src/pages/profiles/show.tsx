import React from 'react';
import {
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

const ProfileShow = (props: any) => (
    <Show title={<Title />} {...props}>
        <SimpleShowLayout>
            <TextField source="user.email" />
            <TextField source="user.firstname" />
            <TextField source="user.lastname" />
            <TextField source="user.age" />
            <TextField source="user.gender" />
            <TextField source="user.university.name" />
            <TextField source="user.role" />
            <TextField source="goals" />
            <TextField source="nativeLanguage.code" />
            <TextField source="learningLanguage.code" />
            <TextField source="learningLanguage.level" />
            <TextField source="meetingFrequency" />
            <ArrayField sortable={false} source="interests">
                <SingleFieldList>
                    <ChipField clickable={false} source="name" />
                </SingleFieldList>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);

export default ProfileShow;
