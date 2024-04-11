/* eslint-disable react/no-unstable-nested-components */
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGetIdentity, useGetList, useGetOne, useRecordContext, useTranslate } from 'react-admin';
import {
    LearningLanguage,
    LearningLanguageTandem,
    getEffectiveLearningType,
    isJoker,
} from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import { TandemStatus } from '../../../entities/Tandem';
import { PairingMode, isCentralUniversity } from '../../../entities/University';
import queryClient from '../../../queryClient';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import TandemActions, { TandemAction } from './Actions/TandemActions';
import TandemFilters from './TandemTable/TandemFilters';
import TandemTable from './TandemTable/TandemTable';
import usePagination from './TandemTable/usePagination';
import useTandemMatchesFilters from './TandemTable/useTandemMatchesFilters';

// TODO(futur): handle inactive tandem
const ShowTandems = () => {
    const translate = useTranslate();

    const record = useRecordContext<LearningLanguage>();
    const isJokerLearningLanguage = isJoker(record);
    const userIsFromCentralUniversity = record?.profile?.user
        ? isCentralUniversity(record.profile.user.university)
        : undefined;

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
                universityIds:
                    identity?.universityId && userIsFromCentralUniversity
                        ? [...selectedUniversityIds, identity.universityId]
                        : [],
                count: 0,
            },
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
    const { resetPage, visibleRows, ...pagination } = usePagination<Match>(filteredMatches);
    useEffect(() => {
        resetPage();
    }, [firstnameFilter, lastnameFilter, roleFilter]);

    if (isLoadingIdentity || isLoadingTandem) {
        return <CircularProgress />;
    }
    if (isErrorTandem && retryTandemQuery) {
        console.error(errorTandem);

        return <p>{translate('learning_languages.show.tandems.error')}</p>;
    }

    const handleTandemAction = async (action?: TandemAction) => {
        if (hasActiveTandem && action === TandemAction.REFUSE) {
            // We need to manually remove query from cache since underlying http call will return 404
            // after existing tandem has been deleted
            await queryClient.removeQueries({
                queryKey: ['learning-languages/tandems', 'getOne', { id: record?.id.toString(), meta: undefined }],
            });
        }
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
                    rows={tandemPartners}
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
                    rows={tandemPartners}
                />
            </>
        );
    }

    return (
        <>
            <Box>
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
                            rows={tandem?.status === TandemStatus.DRAFT ? tandemPartners : []}
                        />
                    )}
                </Box>
            </Box>
            {record.profile.user.university.pairingMode !== PairingMode.AUTOMATIC && (
                <Box sx={{ marginTop: '2rem' }}>
                    <Typography variant="h6">{translate('learning_languages.show.tandems.matches.title')}</Typography>
                    <Box sx={{ marginTop: 1 }}>
                        {isLoadingMatches && <CircularProgress />}
                        {isErrorMatches && <p>{translate('learning_languages.show.tandems.matches.error')}</p>}
                        {!isLoadingMatches &&
                            !isErrorMatches &&
                            (matches && matches?.length > 0 ? (
                                <>
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
                                    <Box sx={{ marginTop: 0.5 }}>
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
                                            pagination={pagination}
                                            rows={visibleRows.map((match) => ({
                                                ...match.target,
                                                compatibilityScore: match.score.total,
                                                matchScore: match.score,
                                                effectiveLearningType: getEffectiveLearningType(record, match.target),
                                            }))}
                                        />
                                    </Box>
                                </>
                            ) : (
                                <p>{translate('learning_languages.show.tandems.matches.noResults')}</p>
                            ))}
                    </Box>
                </Box>
            )}
        </>
    );
};
export default ShowTandems;
