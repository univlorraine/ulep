import { Box } from '@mui/material';
import React from 'react';

import { DateField, FunctionField, Show, SimpleShowLayout, TextField, useTranslate } from 'react-admin';
import { LearningLanguage } from '../../../entities/LearningLanguage';
import ProfileLink from '../ui/ProfileLink';
import ShowTandems from './ShowTandems';

const LearningLanguageShow = () => {
    const translate = useTranslate();

    return (
        <Show>
            <SimpleShowLayout>
                <FunctionField
                    render={(data: LearningLanguage) =>
                        data?.profile && <ProfileLink profile={data.profile} variant="h5" />
                    }
                />
                <DateField label={translate('learning_languages.show.fields.createdAt')} source="createdAt" />
                <TextField label={translate('learning_languages.show.fields.learnedLanguage')} source="name" />
                <TextField label={translate('learning_languages.show.fields.level')} source="level" />
            </SimpleShowLayout>

            <Box sx={{ padding: 2 }}>
                <ShowTandems />
            </Box>
        </Show>
    );
};
export default LearningLanguageShow;
