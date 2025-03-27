/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
