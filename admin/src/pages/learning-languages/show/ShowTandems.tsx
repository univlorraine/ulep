import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGetIdentity, useGetList, useGetOne, useGetRecordId, useTranslate } from 'react-admin';
import { DisplayRole, DisplayLearningType } from '../../../components/translated';
import { LearningLanguageTandem } from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import { TandemStatus } from '../../../entities/Tandem';
import ProfileLink from '../ui/ProfileLink';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import ValidateTandem from './ValidateTandem';

// TODO(NEXT): Relaunch global routine when validating / refusing a tandem

const ShowTandems = () => {
    const translate = useTranslate();

    const recordId = useGetRecordId();

    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    const [retryTandemQuery, setRetryTandemQuery] = useState<boolean>(false);
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
            enabled: !!recordId && !isLoadingIdentity,
            retry: retryTandemQuery ? 3 : false,
            onError: (err) => {
                if ((err as Error)?.cause !== 404) {
                    // Note: workaround to not consider no tandem as an error
                    setRetryTandemQuery(true);
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
                universityIds: identity?.universityId ? [...selectedUniversityIds, identity.universityId] : [],
            },
        },
        {
            enabled:
                !!recordId &&
                !isLoadingTandem &&
                !hasActiveTandem &&
                !isLoadingIdentity &&
                identity?.isCentralUniversity,
        }
    );

    if (isLoadingIdentity || isLoadingTandem) {
        return <CircularProgress />;
    }
    if (isErrorTandem && retryTandemQuery) {
        console.error(errorTandem);

        return <p>{translate('learning_languages.show.tandems.error')}</p>;
    }

    if (hasActiveTandem) {
        return (
            <>
                <Typography variant="h6">{translate('learning_languages.show.tandems.active.title')}</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {translate('learning_languages.show.tandems.active.tableColumns.profile')}
                            </TableCell>
                            <TableCell>
                                {translate('learning_languages.show.tandems.active.tableColumns.learnedLanguage')}
                            </TableCell>
                            <TableCell>
                                {translate('learning_languages.show.tandems.active.tableColumns.level')}
                            </TableCell>
                            <TableCell>
                                {translate('learning_languages.show.tandems.active.tableColumns.university')}
                            </TableCell>
                            <TableCell>
                                {translate('learning_languages.show.tandems.active.tableColumns.role')}
                            </TableCell>
                            <TableCell>
                                {translate('learning_languages.show.tandems.active.tableColumns.learningType')}
                            </TableCell>
                            <TableCell>
                                {translate('learning_languages.show.tandems.active.tableColumns.date')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <ProfileLink profile={tandem.partner} />
                            </TableCell>
                            <TableCell>{tandem.learningLanguage.name}</TableCell>
                            <TableCell>{tandem.learningLanguage.level}</TableCell>
                            <TableCell>{tandem.partner.user.university.name}</TableCell>
                            <TableCell>
                                <DisplayRole role={tandem.partner.user.role} />
                            </TableCell>
                            <TableCell>
                                <DisplayLearningType learningType={tandem.partner.learningType} />
                            </TableCell>
                            <TableCell>{new Date(tandem.learningLanguage.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </>
        );
    }

    const handleValidateTandem = async () => {
        await refetchTandem();
        await refetchMatches();
    };

    return (
        <>
            {identity?.isCentralUniversity && (
                <Box>
                    <Typography variant="h6">{translate('learning_languages.show.tandems.matches.title')}</Typography>
                    <Box sx={{ marginTop: 1 }}>
                        {isLoadingMatches && <CircularProgress />}
                        {isErrorMatches && <p>{translate('learning_languages.show.tandems.matches.error')}</p>}
                        {matches && matches?.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {translate('learning_languages.show.tandems.matches.tableColumns.profile')}
                                        </TableCell>
                                        <TableCell>
                                            {translate(
                                                'learning_languages.show.tandems.matches.tableColumns.learnedLanguage'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {translate('learning_languages.show.tandems.matches.tableColumns.level')}
                                        </TableCell>
                                        <TableCell>
                                            {translate(
                                                'learning_languages.show.tandems.matches.tableColumns.university'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {translate('learning_languages.show.tandems.matches.tableColumns.role')}
                                        </TableCell>
                                        <TableCell>
                                            {translate(
                                                'learning_languages.show.tandems.matches.tableColumns.learningType'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {translate('learning_languages.show.tandems.matches.tableColumns.date')}
                                        </TableCell>
                                        <TableCell>
                                            {translate('learning_languages.show.tandems.matches.tableColumns.score')}
                                        </TableCell>
                                        <TableCell>
                                            {translate('learning_languages.show.tandems.matches.tableColumns.actions')}
                                        </TableCell>
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
                                            <TableCell>{match.target.profile?.user.university.name}</TableCell>
                                            <TableCell>
                                                <DisplayRole role={match.target.profile?.user.role} />
                                            </TableCell>
                                            <TableCell>
                                                <DisplayLearningType
                                                    learningType={match.target.profile?.learningType}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(match.target.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{match.score.total * 100}%</TableCell>
                                            <TableCell>
                                                <ValidateTandem
                                                    learningLanguageIds={[recordId.toString(), match.target.id]}
                                                    onTandemValidated={handleValidateTandem}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>{translate('learning_languages.show.tandems.matches.noResults')}</p>
                        )}
                    </Box>
                </Box>
            )}
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6">
                    {identity?.isCentralUniversity
                        ? translate('learning_languages.show.tandems.globalSuggestions.title')
                        : translate('learning_languages.show.tandems.globalSuggestions.titleNotCentralUniversity')}
                </Typography>
                <Box sx={{ marginTop: 1 }}>
                    {!retryTandemQuery ? (
                        <p>{translate('learning_languages.show.tandems.globalSuggestions.noResult')}</p>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {translate('learning_languages.show.tandems.matches.tableColumns.profile')}
                                    </TableCell>
                                    <TableCell>
                                        {translate(
                                            'learning_languages.show.tandems.matches.tableColumns.learnedLanguage'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {translate('learning_languages.show.tandems.matches.tableColumns.level')}
                                    </TableCell>
                                    <TableCell>
                                        {translate('learning_languages.show.tandems.matches.tableColumns.university')}
                                    </TableCell>
                                    <TableCell>
                                        {translate('learning_languages.show.tandems.matches.tableColumns.role')}
                                    </TableCell>
                                    <TableCell>
                                        {translate('learning_languages.show.tandems.matches.tableColumns.learningType')}
                                    </TableCell>
                                    <TableCell>
                                        {translate('learning_languages.show.tandems.matches.tableColumns.date')}
                                    </TableCell>
                                    <TableCell>
                                        {translate('learning_languages.show.tandems.matches.tableColumns.score')}
                                    </TableCell>
                                    <TableCell>
                                        {translate('learning_languages.show.tandems.matches.tableColumns.actions')}
                                    </TableCell>
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
                                        <TableCell>{tandem.partner.user.university.name}</TableCell>
                                        <TableCell>
                                            <DisplayRole role={tandem.partner.user.role} />
                                        </TableCell>
                                        <TableCell>
                                            <DisplayLearningType learningType={tandem.partner.learningType} />
                                        </TableCell>

                                        <TableCell>
                                            {new Date(tandem.learningLanguage.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>N/A</TableCell>
                                        <TableCell>
                                            <ValidateTandem
                                                onTandemValidated={handleValidateTandem}
                                                tandemId={tandem.id}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </Box>
            </Box>
        </>
    );
};
export default ShowTandems;
