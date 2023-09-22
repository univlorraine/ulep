/* eslint-disable react/no-unstable-nested-components */
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGetIdentity, useGetList, useGetOne, useGetRecordId, useTranslate } from 'react-admin';
import { LearningLanguageTandem } from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import { TandemStatus } from '../../../entities/Tandem';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import TandemActions from './TandemActions';
import TandemTable from './TandemTable';

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
                if ((err as Error)?.cause === 404) {
                    return undefined;
                }

                setRetryTandemQuery(true);

                return err;
            },
            onSuccess: () => {
                setRetryTandemQuery(false);
            },
        }
    );

    const hasActiveTandem = tandem?.status === TandemStatus.ACTIVE;
    const hasTandemWaitingForValidation = tandem?.status === TandemStatus.VALIDATED_BY_ONE_UNIVERSITY;

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
                <TandemTable partners={[tandem.partnerLearningLanguage]} />
            </>
        );
    }

    const handleTandemAction = async () => {
        await refetchTandem();
        await refetchMatches();
    };

    if (hasTandemWaitingForValidation && !isErrorTandem) {
        const isUserValidationNeeded = !tandem.universityValidations.includes(identity?.universityId);

        return (
            <>
                <Typography variant="h6">
                    {translate('learning_languages.show.tandems.waitingValidation.title')}
                </Typography>
                <TandemTable
                    actions={
                        isUserValidationNeeded
                            ? () => (
                                  <TandemActions
                                      learningLanguageIds={[
                                          tandem.userLearningLanguage.id,
                                          tandem.partnerLearningLanguage.id,
                                      ]}
                                      onTandemAction={handleTandemAction}
                                      tandemId={tandem.id}
                                      relaunchGlobalRoutineOnRefuse
                                  />
                              )
                            : undefined
                    }
                    partners={[tandem.partnerLearningLanguage]}
                />
            </>
        );
    }

    return (
        <>
            {identity?.isCentralUniversity && (
                <Box>
                    <Typography variant="h6">{translate('learning_languages.show.tandems.matches.title')}</Typography>
                    <Box sx={{ marginTop: 1 }}>
                        {isLoadingMatches && <CircularProgress />}
                        {isErrorMatches && <p>{translate('learning_languages.show.tandems.matches.error')}</p>}
                        {!isLoadingMatches && !isErrorMatches && matches && matches?.length > 0 ? (
                            <TandemTable
                                actions={(partner) => (
                                    <TandemActions
                                        learningLanguageIds={[recordId.toString(), partner.id]}
                                        onTandemAction={handleTandemAction}
                                        relaunchGlobalRoutineOnAccept={
                                            !tandem || tandem.partnerLearningLanguage.id !== partner.id
                                        }
                                        relaunchGlobalRoutineOnRefuse={
                                            tandem?.partnerLearningLanguage.id === partner.id
                                        }
                                    />
                                )}
                                partners={matches.map((match) => ({
                                    ...match.target,
                                    score: match.score.total,
                                }))}
                            />
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
                    {(isErrorTandem && !retryTandemQuery) || !tandem ? (
                        <p>{translate('learning_languages.show.tandems.globalSuggestions.noResult')}</p>
                    ) : (
                        <TandemTable
                            actions={() => (
                                <TandemActions
                                    learningLanguageIds={[recordId.toString(), tandem.partnerLearningLanguage.id]}
                                    onTandemAction={handleTandemAction}
                                    relaunchGlobalRoutineOnRefuse
                                />
                            )}
                            partners={tandem?.status === TandemStatus.DRAFT ? [tandem.partnerLearningLanguage] : []}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};
export default ShowTandems;
