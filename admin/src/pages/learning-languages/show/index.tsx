import { Box } from '@mui/material';
import React from 'react';

import {
    BooleanField,
    DateField,
    FunctionField,
    Show,
    SimpleShowLayout,
    TextField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { DisplayGender, DisplayLearningType, DisplayRole } from '../../../components/translated';
import Language from '../../../entities/Language';
import { LearningLanguage, getLearningLanguageUniversityAndCampusString } from '../../../entities/LearningLanguage';
import ProfileLink from '../ui/ProfileLink';
import ShowTandems from './ShowTandems';

const Title = () => {
    const record = useRecordContext();
    const translate = useTranslate();

    if (!record?.profile?.user) {
        return null;
    }

    return (
        <span>
            {record.profile.user.firstname} {record.profile.user.lastname} -{' '}
            {translate(`languages_code.${record.code}`)}
        </span>
    );
};

const LearningLanguageShow = () => {
    const translate = useTranslate();

    return (
        <Show title={<Title />}>
            <SimpleShowLayout>
                <FunctionField
                    render={(data: LearningLanguage) =>
                        data?.profile && <ProfileLink profile={data.profile} variant="h5" />
                    }
                />
                <FunctionField
                    label={translate('learning_languages.list.tableColumns.university')}
                    render={(data: LearningLanguage) => getLearningLanguageUniversityAndCampusString(data)}
                />
                <DateField label={translate('learning_languages.show.fields.createdAt')} source="createdAt" />
                <FunctionField
                    label={translate('learning_languages.list.tableColumns.learnedLanguage')}
                    render={(record: Language) => translate(`languages_code.${record.code}`)}
                    source="code"
                />
                <TextField label={translate('learning_languages.show.fields.level')} source="level" />
                <FunctionField
                    label={translate('learning_languages.show.fields.status')}
                    render={(data: LearningLanguage) =>
                        translate(`global.userStatus.${data.profile.user.status?.toLowerCase()}`)
                    }
                />
                <FunctionField
                    label={translate('learning_languages.show.fields.role')}
                    render={(data: LearningLanguage) => <DisplayRole role={data.profile?.user.role} />}
                />
                <FunctionField
                    label={translate('learning_languages.show.fields.learningType')}
                    render={(data: LearningLanguage) => <DisplayLearningType learningType={data.learningType} />}
                />
                <BooleanField label={translate('learning_languages.show.fields.sameGender')} source="sameGender" />
                <FunctionField
                    label={translate('learning_languages.show.fields.gender')}
                    render={(data: LearningLanguage) => <DisplayGender gender={data.profile?.user.gender} />}
                />
                <BooleanField label={translate('learning_languages.show.fields.sameAge')} source="sameAge" />
                <TextField label={translate('learning_languages.show.fields.age')} source="profile.user.age" />
                <BooleanField
                    label={translate('learning_languages.show.fields.certificateOption')}
                    source="certificateOption"
                />
                <BooleanField
                    label={translate('learning_languages.show.fields.specificProgram')}
                    source="specificProgram"
                />
                <BooleanField label={translate('learning_languages.show.fields.hasPriority')} source="hasPriority" />
            </SimpleShowLayout>

            <Box sx={{ padding: 2 }}>
                <ShowTandems />
            </Box>
        </Show>
    );
};
export default LearningLanguageShow;
