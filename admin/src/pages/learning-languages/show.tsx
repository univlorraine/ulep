import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';

import {
    DateField,
    FunctionField,
    Loading,
    Show,
    SimpleShowLayout,
    TextField,
    useGetList,
    useGetRecordId,
    useShowContext,
} from 'react-admin';
import LearningLanguage from '../../entities/LearningLanguage';
import { Match } from '../../entities/Match';
import { getProfileDisplayName } from '../../entities/Profile';
import useLearningLanguagesStore from './useLearningLanguagesStore';

const LearningLanguageShow = () => {
    const { isLoading, isFetching, error } = useShowContext<LearningLanguage>();
    const { selectedUniversityIds } = useLearningLanguagesStore();

    const recordId = useGetRecordId();

    const {
        isLoading: isLoadingMatches,
        isError: isErrorMatches,
        data: matches,
    } = useGetList<Match>(
        'learning-languages/matches',
        {
            filter: {
                id: recordId,
                universityIds: selectedUniversityIds,
            },
        },
        {
            enabled: !!recordId,
        }
    );

    if (isLoading || isFetching) {
        return <Loading />;
    }
    if (error) {
        console.error(error);

        return <div>Error</div>;
    }

    // TODO(NOW+0): don't get match if user not from central university

    return (
        <Show title="TODO(NOW)">
            <div>
                <SimpleShowLayout>
                    <FunctionField
                        label="Name"
                        render={(data: LearningLanguage) => (
                            <a href={`/profiles/${data?.profile.id}`}>{getProfileDisplayName(data?.profile)}</a>
                            // TODO(NOW+1): see with Reference field
                        )}
                    />
                    <DateField label="Date demande" source="createdAt" />
                    <TextField label="Learning language" source="name" />
                    <TextField label="level" source="level" />
                </SimpleShowLayout>

                <Box sx={{ marginTop: 5, padding: 2 }}>
                    <h2>Routine indiv</h2>
                    <Box sx={{ marginTop: 1 }}>
                        {isLoadingMatches && <Loading />}
                        {isErrorMatches && <div>ERROR</div>}
                        {matches && matches?.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Profile</TableCell>
                                        <TableCell>Langue demandée</TableCell>
                                        <TableCell>Niveau</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Matching</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {matches.map((match, index) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <TableRow key={`match-${index}`}>
                                            <TableCell>{getProfileDisplayName(match.target.profile)}</TableCell>
                                            <TableCell>{match.target.name}</TableCell>
                                            <TableCell>{match.target.level}</TableCell>
                                            <TableCell>
                                                {new Date(match.target.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{match.score.total * 100}%</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div>Sorry, no match</div>
                        )}
                    </Box>
                </Box>
            </div>
        </Show>
    );
};

export default LearningLanguageShow;
