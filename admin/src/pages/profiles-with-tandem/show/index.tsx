import React from 'react';

import { FunctionField, Show } from 'react-admin';

import './show.css';
import { ProfileWithTandems } from '../../../entities/Profile';

const LearningLanguageShow = () => (
    <Show>
        <FunctionField
            render={(record: ProfileWithTandems) => {
                console.log(record);

                return <div />;
            }}
        />
        {/*             <TabbedShowLayout>
                <TabbedShowLayout.Tab label="Espagnol (en attente)">
                    <Typography sx={{ marginTop: 4 }} variant="h3">
                        {translate('learning_languages.show.management.title')}
                    </Typography>

                    <Box className="tandem-management" />

                    <Box sx={{ padding: 2 }}>
                        <Typography sx={{ marginTop: 4 }} variant="h3">
                            {translate('learning_languages.show.other_proposals.title')}
                        </Typography>
                    </Box>
                </TabbedShowLayout.Tab>
                <TabbedShowLayout.Tab label="Anglais (apparié)">Lorem ipsum</TabbedShowLayout.Tab>
            </TabbedShowLayout> */}
    </Show>
);
export default LearningLanguageShow;
