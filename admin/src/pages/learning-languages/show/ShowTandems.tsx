/* eslint-disable react/no-unstable-nested-components */
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGetIdentity, useGetList, useGetOne, useRecordContext, useTranslate } from 'react-admin';
import { LearningLanguage, LearningLanguageTandem, isJoker } from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import { TandemStatus } from '../../../entities/Tandem';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import TandemActions from './TandemActions';
import TandemTable from './TandemTable';

const ShowTandems = () => {
    const translate = useTranslate();

    const record = useRecordContext<LearningLanguage>();
    const isJokerLearningLanguage = isJoker(record);

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
            id: record?.id.toString(),
        },
        {
            enabled: !!record?.id && !isLoadingIdentity,
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
                id: record?.id,
                universityIds: identity?.universityId ? [...selectedUniversityIds, identity.universityId] : [],
            },
        },
        {
            enabled:
                !!record?.id &&
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
                <TandemTable
                    displayTandemLanguage={isJokerLearningLanguage}
                    // TODO(NOW+2): display language in index
                    partners={[
                        {
                            ...tandem.partnerLearningLanguage,
                            tandemLanguage: tandem.userLearningLanguage.tandemLanguage,
                        },
                    ]}
                />
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
                                      // TODO(NOW+2): display language in index
                                      onTandemAction={handleTandemAction}
                                      tandemId={tandem.id}
                                      relaunchGlobalRoutineOnRefuse
                                  />
                              )
                            : undefined
                    }
                    displayTandemLanguage={isJokerLearningLanguage}
                    partners={[
                        {
                            ...tandem.partnerLearningLanguage,
                            tandemLanguage: tandem.userLearningLanguage.tandemLanguage,
                        },
                    ]}
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
                                        learningLanguageIds={[record?.id.toString(), partner.id]}
                                        onTandemAction={handleTandemAction}
                                        relaunchGlobalRoutineOnAccept={
                                            !tandem || tandem.partnerLearningLanguage.id !== partner.id
                                        }
                                        relaunchGlobalRoutineOnRefuse={
                                            tandem?.partnerLearningLanguage.id === partner.id
                                        }
                                    />
                                )}
                                displayTandemLanguage={isJokerLearningLanguage}
                                partners={matches.map((match) => ({
                                    ...match.target,
                                    score: match.score.total,
                                    tandemLanguage: match.tandemLanguage,
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
                                    learningLanguageIds={[record?.id.toString(), tandem.partnerLearningLanguage.id]}
                                    onTandemAction={handleTandemAction}
                                    relaunchGlobalRoutineOnRefuse
                                />
                            )}
                            displayTandemLanguage={isJokerLearningLanguage}
                            partners={
                                tandem?.status === TandemStatus.DRAFT
                                    ? [
                                          {
                                              ...tandem.partnerLearningLanguage,
                                              tandemLanguage: tandem.userLearningLanguage.tandemLanguage,
                                          },
                                      ]
                                    : []
                            }
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};
export default ShowTandems;
