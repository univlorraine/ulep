/* eslint-disable react/no-unstable-nested-components */
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useRecordContext, useRefresh, useTranslate } from 'react-admin';
import { LearningLanguage, getEffectiveLearningType } from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import { ProfileWithTandems } from '../../../entities/Profile';
import { Tandem } from '../../../entities/Tandem';
import { PairingMode } from '../../../entities/University';
import TandemActions from './Actions/TandemActions';
import TandemFilters from './TandemTable/TandemFilters';
import TandemTable from './TandemTable/TandemTable';
import usePagination from './TandemTable/usePagination';
import useTandemMatchesFilters from './TandemTable/useTandemMatchesFilters';

type OtherProposalsProps = {
    matches: Match[];
    isLoadingMatches: boolean;
    isErrorMatches: boolean;
    isJokerLearningLanguage: boolean;
    userLearningLanguage: LearningLanguage;
    tandem: Tandem | undefined;
};

const OtherProposals = ({
    matches,
    isLoadingMatches,
    isErrorMatches,
    isJokerLearningLanguage,
    userLearningLanguage,
    tandem,
}: OtherProposalsProps) => {
    const translate = useTranslate();
    const record: ProfileWithTandems = useRecordContext();
    const refresh = useRefresh();

    const {
        filteredMatches,
        firstnameFilter,
        setFirstnameFilter,
        lastnameFilter,
        setLastnameFilter,
        roleFilter,
        setRoleFilter,
        universityIdFilter,
        setUniversityIdFilter,
    } = useTandemMatchesFilters(matches || []);
    const { resetPage, visibleRows, ...pagination } = usePagination<Match>(filteredMatches);

    useEffect(() => {
        resetPage();
    }, [firstnameFilter, lastnameFilter, roleFilter]);

    const handleTandemAction = async () => {
        refresh();
    };

    return (
        <Box className="other-proposals">
            {record.user.university.pairingMode !== PairingMode.AUTOMATIC && (
                <>
                    <Typography sx={{ marginTop: 4 }} variant="h3">
                        {translate('learning_languages.show.other_proposals.title')}
                    </Typography>
                    <Box sx={{ marginTop: '2rem' }}>
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
                                                setUniversityId={setUniversityIdFilter}
                                                universityId={universityIdFilter}
                                            />
                                        </Box>
                                        <Box sx={{ marginTop: 0.5 }}>
                                            <TandemTable
                                                actions={(partner) => (
                                                    <TandemActions
                                                        learningLanguageIds={[userLearningLanguage.id, partner.id]}
                                                        onTandemAction={handleTandemAction}
                                                        relaunchGlobalRoutineOnAccept={
                                                            !userLearningLanguage.tandem ||
                                                            tandem?.learningLanguages[0].id !== partner.id
                                                        }
                                                        relaunchGlobalRoutineOnRefuse={
                                                            tandem?.learningLanguages[0]?.id === partner.id
                                                        }
                                                    />
                                                )}
                                                displayTandemLanguage={isJokerLearningLanguage}
                                                pagination={pagination}
                                                rows={visibleRows.map((match) => ({
                                                    ...match.target,
                                                    compatibilityScore: match.score.total,
                                                    matchScore: match.score,
                                                    effectiveLearningType: getEffectiveLearningType(
                                                        userLearningLanguage,
                                                        match.target
                                                    ),
                                                }))}
                                            />
                                        </Box>
                                    </>
                                ) : (
                                    <p>{translate('learning_languages.show.tandems.matches.noResults')}</p>
                                ))}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default OtherProposals;
