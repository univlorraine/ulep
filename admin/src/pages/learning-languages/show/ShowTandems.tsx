/* eslint-disable react/no-unstable-nested-components */
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGetIdentity, useGetList, useGetOne, useRecordContext, useTranslate } from 'react-admin';
import {
    LearningLanguage,
    LearningLanguageTandem,
    getEffectiveLearningType,
    isJoker,
} from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import { TandemStatus } from '../../../entities/Tandem';
import { isCentralUniversity } from '../../../entities/University';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import TandemActions from './Actions/TandemActions';
import TandemFilters from './TandemTable/TandemFilters';
import TandemTable from './TandemTable/TandemTable';
import useTandemMatchesFilters from './TandemTable/useTandemMatchesFilters';

// TODO(futur): handle inactive tandem
const ShowTandems = () => {
    const translate = useTranslate();

    const record = useRecordContext<LearningLanguage>();
    const isJokerLearningLanguage = isJoker(record);
    const userIsFromCentralUniversity = isCentralUniversity(record?.profile?.user.university);

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

    let getLearningLanguagesMatchesFilters: any = {
        id: record?.id,
        universityIds: identity?.universityId ? [...selectedUniversityIds, identity.universityId] : [],
    };
    if (!userIsFromCentralUniversity) {
        getLearningLanguagesMatchesFilters = {
            ...getLearningLanguagesMatchesFilters,
            count: 0,
        };
    }

    // TODO(NOW): manage no result

    const {
        isLoading: isLoadingMatches,
        isError: isErrorMatches,
        refetch: refetchMatches,
        data: matches,
    } = useGetList<Match>(
        'learning-languages/matches',
        {
            filter: getLearningLanguagesMatchesFilters,
        },
        {
            enabled: !!record?.id && !isLoadingTandem && !hasActiveTandem && !isLoadingIdentity,
        }
    );

    const {
        filteredMatches,
        firstnameFilter,
        setFirstnameFilter,
        lastnameFilter,
        setLastnameFilter,
        roleFilter,
        setRoleFilter,
    } = useTandemMatchesFilters(matches || []);

    if (isLoadingIdentity || isLoadingTandem) {
        return <CircularProgress />;
    }
    if (isErrorTandem && retryTandemQuery) {
        console.error(errorTandem);

        return <p>{translate('learning_languages.show.tandems.error')}</p>;
    }

    const handleTandemAction = async () => {
        await refetchTandem();
        await refetchMatches();
    };

    const tandemPartners = tandem
        ? [
              {
                  ...tandem.partnerLearningLanguage,
                  compatibilityScore: tandem.compatibilityScore,
                  effectiveLearningType: getEffectiveLearningType(record, tandem.partnerLearningLanguage),
              },
          ]
        : [];

    if (hasActiveTandem) {
        return (
            <>
                <Typography variant="h6">{translate('learning_languages.show.tandems.active.title')}</Typography>
                <TandemTable
                    actions={() => (
                        <TandemActions
                            learningLanguageIds={[record?.id.toString(), tandem.partnerLearningLanguage.id]}
                            onTandemAction={handleTandemAction}
                            disableCreateButton
                            relaunchGlobalRoutineOnRefuse
                        />
                    )}
                    displayTandemLanguage={isJokerLearningLanguage}
                    partners={tandemPartners}
                />
            </>
        );
    }

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
                    displayTandemLanguage={isJokerLearningLanguage}
                    partners={tandemPartners}
                />
            </>
        );
    }

    return (
        <>
            {userIsFromCentralUniversity && (
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
                                    compatibilityScore: match.score.total,
                                    matchScore: match.score,
                                    effectiveLearningType: getEffectiveLearningType(record, match.target),
                                }))}
                            />
                        ) : (
                            <p>{translate('learning_languages.show.tandems.matches.noResults')}</p>
                        )}
                    </Box>
                </Box>
            )}
            <Box sx={{ marginTop: '2rem' }}>
                <Typography variant="h6">
                    {userIsFromCentralUniversity
                        ? translate('learning_languages.show.tandems.globalSuggestions.title')
                        : translate('learning_languages.show.tandems.globalSuggestions.titleNotCentralUniversity')}
                </Typography>
                <Box sx={{ marginTop: 1 }}>
                    {(isErrorTandem && !retryTandemQuery) || !tandem || tandem.status === TandemStatus.INACTIVE ? (
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
                            partners={tandem?.status === TandemStatus.DRAFT ? tandemPartners : []}
                        />
                    )}
                </Box>
            </Box>
            {!userIsFromCentralUniversity && (
                <Box sx={{ marginTop: '2rem' }}>
                    <Typography variant="h6">{translate('learning_languages.show.tandems.matches.title')}</Typography>
                    <Box sx={{ marginTop: 1 }}>
                        <TandemFilters
                            firstname={firstnameFilter}
                            lastname={lastnameFilter}
                            role={roleFilter}
                            setFirstname={setFirstnameFilter}
                            setLastname={setLastnameFilter}
                            setRole={setRoleFilter}
                        />
                    </Box>
                    <Box sx={{ marginTop: 1 }}>
                        {isLoadingMatches && <CircularProgress />}
                        {isErrorMatches && <p>{translate('learning_languages.show.tandems.matches.error')}</p>}
                        {!isLoadingMatches && !isErrorMatches && filteredMatches && filteredMatches?.length > 0 ? (
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
                                partners={filteredMatches.map((match) => ({
                                    ...match.target,
                                    compatibilityScore: match.score.total,
                                    matchScore: match.score,
                                    effectiveLearningType: getEffectiveLearningType(record, match.target),
                                }))}
                                paginationEnabled
                            />
                        ) : (
                            <p>{translate('learning_languages.show.tandems.matches.noResults')}</p>
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};
export default ShowTandems;
