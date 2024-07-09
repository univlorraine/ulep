import { TabContext, TabList } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import React from 'react';

import { FunctionField, Show, SimpleShowLayout, useRecordContext, useTranslate } from 'react-admin';

import { useLocation } from 'react-router-dom';
import { ProfileWithTandems, getProfileDisplayName } from '../../../entities/Profile';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';
import LearningLanguageTabContent from './LearninLanguageTabContent';

import './show.css';

const TabsComponent = () => {
    const translate = useTranslate();
    const record: ProfileWithTandems = useRecordContext();

    const { state: learningLanguageCode } = useLocation();
    const [value, setValue] = React.useState(
        learningLanguageCode?.learningLanguageCode || record.learningLanguages[0].code
    );
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange}>
                    {record.learningLanguages.map((learningLanguage) => {
                        const label = learningLanguage.tandem
                            ? `${learningLanguage.name} (${translate(
                                  `learning_languages.status.${learningLanguage.tandem.status}`
                              )})`
                            : learningLanguage.name;

                        return <Tab key={learningLanguage.code} label={label} value={learningLanguage.code} />;
                    })}
                </TabList>
            </Box>
            {record.learningLanguages.map((learningLanguage) => (
                <LearningLanguageTabContent key={learningLanguage.code} learningLanguage={learningLanguage} />
            ))}
        </TabContext>
    );
};

const LearningLanguageShow = () => (
    <Show>
        <FunctionField
            render={(profile: ProfileWithTandems) => (
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="h2">
                        {getProfileDisplayName(profile)} ({codeLanguageToFlag(profile.nativeLanguage.code)})
                    </Typography>
                </Box>
            )}
        />
        <SimpleShowLayout>
            <TabsComponent />
        </SimpleShowLayout>
    </Show>
);

export default LearningLanguageShow;
