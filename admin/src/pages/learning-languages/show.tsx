import { Box } from '@mui/material';
import React from 'react';

import { DateField, FunctionField, Loading, Show, SimpleShowLayout, TextField, useShowContext } from 'react-admin';
import { LearningLanguage } from '../../entities/LearningLanguage';
import ShowTandems from './show/ShowTandems';
import ProfileLink from './ui/ProfileLink';

const LearningLanguageShow = () => {
    const { isLoading, isFetching, error } = useShowContext<LearningLanguage>();
    if (isLoading || isFetching) {
        return <Loading />;
    }
    if (error) {
        console.error(error);

        return (
            <div>
                <p>Une erreur est survenur lors de la récupération de la demande</p>
            </div>
        );
    }

    // TODO(NOW+0): don't get match if user not from central university

    return (
        <Show title="TODO(NOW)">
            <SimpleShowLayout>
                <FunctionField
                    render={(data: LearningLanguage) =>
                        data?.profile && <ProfileLink profile={data.profile} variant="h5" />
                    }
                />
                <DateField label="Date demande" source="createdAt" />
                <TextField label="Learning language" source="name" />
                <TextField label="level" source="level" />
            </SimpleShowLayout>

            <Box sx={{ padding: 2 }}>
                <ShowTandems />
            </Box>
        </Show>
    );
};

export default LearningLanguageShow;
