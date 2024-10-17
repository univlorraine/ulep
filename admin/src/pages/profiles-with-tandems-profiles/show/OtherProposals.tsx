/* eslint-disable react/no-unstable-nested-components */
import { Box, CircularProgress, SortDirection, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRefresh, useTranslate } from 'react-admin';
import {
    LearningLanguageWithTandemWithPartnerProfile,
    getEffectiveLearningType,
} from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import { TandemWithPartnerLearningLanguage } from '../../../entities/Tandem';
import TandemActions from './Actions/TandemActions';
import TandemFilters from './TandemTable/TandemFilters';
import TandemTable, { TandemTableFieldToSort } from './TandemTable/TandemTable';
import usePagination from './TandemTable/usePagination';
import useSortedTandemMatches from './TandemTable/useSortedTandemMatches';
import useTandemMatchesFilters from './TandemTable/useTandemMatchesFilters';

type OtherProposalsProps = {
    matches: Match[];
    isLoadingMatches: boolean;
    isErrorMatches: boolean;
    isJokerLearningLanguage: boolean;
    userLearningLanguage: LearningLanguageWithTandemWithPartnerProfile;
    tandem: TandemWithPartnerLearningLanguage | undefined;
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
    const refresh = useRefresh();
    const [sortDirection, setSortDirection] = useState<SortDirection>(false);
    const [fieldToSort, setFieldToSort] = useState<TandemTableFieldToSort>('level');
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
    const sortedMatches = useSortedTandemMatches(filteredMatches, sortDirection, fieldToSort);
    const { resetPage, visibleRows, ...pagination } = usePagination<Match>(sortedMatches);

    useEffect(() => {
        resetPage();
    }, [firstnameFilter, lastnameFilter, roleFilter]);

    const handleTandemAction = async () => {
        refresh();
    };

    return (
        <Box className="other-proposals">
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
                                                    tandem?.partnerLearningLanguage.id !== partner.id
                                                }
                                                relaunchGlobalRoutineOnRefuse={
                                                    tandem?.partnerLearningLanguage?.id === partner.id
                                                }
                                            />
                                        )}
                                        displayTandemLanguage={isJokerLearningLanguage}
                                        fieldToSort={fieldToSort}
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
                                        setFieldToSort={setFieldToSort}
                                        setSortDirection={setSortDirection}
                                        sortDirection={sortDirection}
                                    />
                                </Box>
                            </>
                        ) : (
                            <p>{translate('learning_languages.show.tandems.matches.noResults')}</p>
                        ))}
                </Box>
            </Box>
        </Box>
    );
};

export default OtherProposals;
