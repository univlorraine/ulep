import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGetList, useGetOne, useGetRecordId } from 'react-admin';
import { LearningLanguageTandem, TandemStatus } from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import ProfileLink from '../ui/ProfileLink';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import ValidateTandem from './ValidateTandem';

// TODO(NOW+2): check how to relaunch global routine when validating / refusing a tandem

const ShowTandems = () => {
    const recordId = useGetRecordId();

    const [noAssociatedTandem, setNoAssociatedTandem] = useState<boolean>(false);
    const {
        isLoading: isLoadingTandem,
        isError: isErrorTandem,
        error: errorTandem,
        refetch: refetchTandem,
        data: tandem,
    } = useGetOne<LearningLanguageTandem>(
        'learning-languages/tandems',
        {
            id: recordId.toString(),
        },
        {
            enabled: !!recordId,
            retry: noAssociatedTandem,
            onError: (err) => {
                // Note: workaround to not consider no tandem as an error
                if ((err as Error)?.cause === 404) {
                    setNoAssociatedTandem(true);
                }
            },
        }
    );

    const hasActiveTandem = tandem?.status === TandemStatus.ACTIVE;

    const { selectedUniversityIds } = useLearningLanguagesStore();
    const {
        isLoading: isLoadingMatches,
        isError: isErrorMatches,
        refetch: refetchMatches,
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
            enabled: !!recordId && !hasActiveTandem,
        }
    );

    if (isLoadingTandem) {
        return <CircularProgress />;
    }
    if (isErrorTandem) {
        console.error(errorTandem);

        return (
            <div>
                <p>Une erreur est survenur lors de la récupération des tandems</p>
            </div>
        );
    }

    if (hasActiveTandem) {
        return (
            <>
                <Typography variant="h6">En tandem avec</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Profile</TableCell>
                            <TableCell>Langue demandée</TableCell>
                            <TableCell>Niveau</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <ProfileLink profile={tandem.partner} />
                            </TableCell>
                            <TableCell>{tandem.learningLanguage.name}</TableCell>
                            <TableCell>{tandem.learningLanguage.level}</TableCell>
                            <TableCell>{new Date(tandem.learningLanguage.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </>
        );
    }

    return (
        <>
            <Box>
                <Typography variant="h6">Routine individuelle</Typography>
                <Box sx={{ marginTop: 1 }}>
                    {isLoadingMatches && <CircularProgress />}
                    {isErrorMatches && (
                        <div>
                            <p>Une erreur est survenue lors de la récupération des propositions individuelles</p>
                        </div>
                    )}
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
                                        <TableCell>
                                            <ProfileLink profile={match.target.profile} />
                                        </TableCell>
                                        <TableCell>{match.target.name}</TableCell>
                                        <TableCell>{match.target.level}</TableCell>
                                        <TableCell>{new Date(match.target.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{match.score.total * 100}%</TableCell>
                                        <TableCell>TODO: actions</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div>Désolé, il n&lsquo;y a pas de résultats</div>
                    )}
                </Box>
            </Box>
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6">Routine globale</Typography>
                <Box sx={{ marginTop: 1 }}>
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
                            {tandem?.status === TandemStatus.DRAFT && (
                                <TableRow>
                                    <TableCell>
                                        <ProfileLink profile={tandem.partner} />
                                    </TableCell>
                                    <TableCell>{tandem.learningLanguage.name}</TableCell>
                                    <TableCell>{tandem.learningLanguage.level}</TableCell>
                                    <TableCell>
                                        {new Date(tandem.learningLanguage.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>N/A</TableCell>
                                    <TableCell>
                                        <ValidateTandem
                                            onTandemValidated={async () => {
                                                await refetchTandem();
                                                await refetchMatches();
                                            }}
                                            tandemId={tandem.id}
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        </>
    );
};
export default ShowTandems;
