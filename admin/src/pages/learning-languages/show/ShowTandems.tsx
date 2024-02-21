/* eslint-disable react/no-unstable-nested-components */
import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
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
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import TandemActions from './TandemActions';
import TandemTable from './TandemTable/TandemTable';

// TODO(futur): handle inactive tandem
const ShowTandems = () => {
    const translate = useTranslate();

    const record = useRecordContext<LearningLanguage>();
    const isJokerLearningLanguage = isJoker(record);
    // TODO(NOW): extract method
    const userIsFromCentralUniversity = !record?.profile?.user.university.parent;

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

    const [firstnameFilter, setFirstnameFilter] = useState<string>();
    const [lastnameFilter, setLastnameFilter] = useState<string>();
    const [roleFilter, setRoleFilter] = useState<UserRole>();
    let filteredMatches = matches || [];
    if (firstnameFilter) {
        filteredMatches = filteredMatches.filter((match) =>
            match.target.profile.user.firstname.toLowerCase().includes(firstnameFilter.toLowerCase())
        );
    }
    // TODO(NOW+1): optimize loop for filtering
    if (lastnameFilter) {
        filteredMatches = filteredMatches.filter((match) =>
            match.target.profile.user.lastname.toLowerCase().includes(lastnameFilter.toLowerCase())
        );
    }
    if (roleFilter) {
        filteredMatches = filteredMatches.filter((match) => match.target.profile.user.role === roleFilter);
    }

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
            <Box sx={{ marginTop: 3 }}>
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
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6">{translate('learning_languages.show.tandems.matches.title')}</Typography>
                    <Box sx={{ marginTop: 1 }}>
                        <TextField
                            id="firstname-filter"
                            label="Firstname" // TODO(NOW): translate
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFirstnameFilter(event.target.value);
                            }}
                            value={firstnameFilter}
                        />
                        <TextField
                            id="lastname-filter"
                            label="Lastname" // TODO(NOW): translate
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setLastnameFilter(event.target.value);
                            }}
                            value={lastnameFilter}
                        />
                        <FormControl>
                            <InputLabel id="role-filter-label">Role</InputLabel>
                            <Select
                                id="role-filter"
                                label="Role"
                                labelId="role-filter-label"
                                onChange={(event: SelectChangeEvent) => {
                                    setRoleFilter(event.target.value as UserRole);
                                }}
                                value={roleFilter}
                            >
                                <MenuItem value="STUDENT">Student</MenuItem>
                                <MenuItem value="STAFF">Staff</MenuItem>
                            </Select>
                        </FormControl>
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
