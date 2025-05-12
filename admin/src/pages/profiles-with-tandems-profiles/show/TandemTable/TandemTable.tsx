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

import {
    Box,
    SortDirection,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from '@mui/material';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { usePermissions, useRecordContext, useTranslate } from 'react-admin';
import ColoredChips from '../../../../components/ColoredChips';
import { DisplayLearningType } from '../../../../components/translated';
import Language from '../../../../entities/Language';
import { LearningType } from '../../../../entities/LearningLanguage';
import { MatchScore } from '../../../../entities/Match';
import { Profile } from '../../../../entities/Profile';
import { ProfileWithTandemsProfiles } from '../../../../entities/ProfileWithTandemsProfiles';
import codeLanguageToFlag from '../../../../utils/codeLanguageToFlag';
import hasTandemManagementPermission from '../../hasTandemManagementPermission';
import ProfileLink from '../../ui/ProfileLink';
import { Pagination } from './usePagination';

export interface TandemPartner {
    id: string;
    profile: Profile;
    name: string;
    code: string;
    learningType: LearningType;
    effectiveLearningType?: LearningType;
    level: string;
    createdAt: Date;
    matchScore?: MatchScore;
    compatibilityScore?: number;
    tandemLanguage?: Language;
}

export type TandemTableFieldToSort = 'level' | 'age' | 'score' | 'date';

export interface TandemTableProps {
    rows: TandemPartner[];
    actions?: (partner: TandemPartner) => React.ReactNode;
    displayTandemLanguage?: boolean;
    pagination?: Omit<Pagination<TandemPartner>, 'resetPage' | 'visibleRows'>;
    sortDirection: SortDirection;
    fieldToSort?: TandemTableFieldToSort;
    setSortDirection: (value: SortDirection) => void;
    setFieldToSort: (value: TandemTableFieldToSort) => void;
}

const TandemTable = ({
    rows,
    actions,
    displayTandemLanguage,
    pagination,
    sortDirection,
    fieldToSort,
    setSortDirection,
    setFieldToSort,
}: TandemTableProps) => {
    const translate = useTranslate();
    const record: ProfileWithTandemsProfiles | undefined = useRecordContext();
    const { permissions } = usePermissions();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [selectedMatchScore, setSelectedMatchScore] = useState<MatchScore | undefined>();

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, matchScore?: MatchScore) => {
        if (matchScore) {
            setSelectedMatchScore(matchScore);
            setAnchorEl(event.currentTarget);
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleToggleSortDirection = (field: TandemTableFieldToSort) => () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        setFieldToSort(field);
    };

    const getFieldDirection = (field: TandemTableFieldToSort) =>
        fieldToSort === field && sortDirection ? sortDirection : undefined;

    const open = Boolean(anchorEl);

    return (
        <Table className="tandem-table">
            <TableHead>
                <TableRow>
                    {displayTandemLanguage && (
                        <TableCell>
                            {translate('learning_languages.show.tandems.tableColumns.spokenLanguages')}
                        </TableCell>
                    )}
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.profile')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.learnedLanguage')}</TableCell>
                    <TableCell sortDirection="asc">
                        <TableSortLabel
                            active={fieldToSort === 'level'}
                            direction={getFieldDirection('level')}
                            onClick={handleToggleSortDirection('level')}
                        >
                            {translate('learning_languages.show.tandems.tableColumns.level')}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.role')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.learningType')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.gender')}</TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={fieldToSort === 'age'}
                            direction={getFieldDirection('age')}
                            onClick={handleToggleSortDirection('age')}
                        >
                            {translate('learning_languages.show.tandems.tableColumns.age')}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={fieldToSort === 'score'}
                            direction={getFieldDirection('score')}
                            onClick={handleToggleSortDirection('score')}
                        >
                            {translate('learning_languages.show.tandems.tableColumns.score')}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={fieldToSort === 'date'}
                            direction={getFieldDirection('date')}
                            onClick={handleToggleSortDirection('date')}
                        >
                            {translate('learning_languages.show.tandems.tableColumns.date')}
                        </TableSortLabel>
                    </TableCell>
                    {actions && hasTandemManagementPermission(permissions) && (
                        <TableCell>{translate('learning_languages.show.tandems.tableColumns.actions')}</TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((partner) => (
                    <TableRow key={partner.id}>
                        {displayTandemLanguage && (
                            <TableCell>
                                <Box className="chips-box">
                                    {[partner.profile.nativeLanguage, ...partner.profile.masteredLanguages].map(
                                        (language) => (
                                            <ColoredChips
                                                key={language.code}
                                                color="default"
                                                label={codeLanguageToFlag(language.code)}
                                            />
                                        )
                                    )}
                                </Box>
                            </TableCell>
                        )}
                        <TableCell>
                            <ProfileLink profile={partner.profile} />
                            <Typography sx={{ color: '#767676' }}>{partner.profile.user.university.name}</Typography>
                        </TableCell>
                        <TableCell>
                            <ColoredChips color="default" label={codeLanguageToFlag(partner.code)} />
                        </TableCell>
                        <TableCell>{partner.level}</TableCell>
                        <TableCell>
                            <ColoredChips
                                color={partner.profile.user.role === record?.user?.role ? 'success' : 'error'}
                                label={translate(`learning_languages.roles.${partner.profile.user.role}`)}
                                variant="outlined"
                            />
                        </TableCell>
                        <TableCell>
                            <DisplayLearningType
                                effectiveLearningType={partner.effectiveLearningType}
                                learningType={partner.learningType}
                            />
                        </TableCell>
                        <TableCell>
                            {translate(`global.genderValues.${partner.profile.user.gender.toLowerCase()}`)}
                        </TableCell>
                        <TableCell>{partner.profile.user.age}</TableCell>
                        <TableCell>
                            <Typography
                                aria-haspopup="true"
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                onMouseEnter={(event) => handlePopoverOpen(event, partner.matchScore)}
                                onMouseLeave={handlePopoverClose}
                            >
                                {partner.compatibilityScore
                                    ? `${(partner.compatibilityScore * 100).toFixed(0)}%`
                                    : 'N/A'}
                            </Typography>
                        </TableCell>
                        <TableCell>{new Date(partner.createdAt).toLocaleDateString()}</TableCell>
                        {actions && hasTandemManagementPermission(permissions) && (
                            <TableCell>{actions(partner)}</TableCell>
                        )}
                    </TableRow>
                ))}
                {pagination && (
                    <tr>
                        <TablePagination
                            count={pagination.count}
                            onPageChange={(event: unknown, newPage: number) => {
                                pagination.handleChangePage(newPage);
                            }}
                            onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                pagination.handleChangeRowsPerPage(parseInt(event.target.value, 10));
                            }}
                            page={pagination.page}
                            rowsPerPage={pagination.rowsPerPage}
                            rowsPerPageOptions={pagination.rowsPerPageOptions}
                        />
                    </tr>
                )}
            </TableBody>

            <Popover
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                id="mouse-over-popover"
                onClose={handlePopoverClose}
                open={open}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 5,
                            boxShadow: 2,
                            padding: 1,
                        },
                    },
                }}
                sx={{
                    pointerEvents: 'none',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>
                    <strong>Age : </strong>
                    {selectedMatchScore?.age ? selectedMatchScore.age.toFixed(4) : 0}
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <strong>Gender : </strong>
                    {selectedMatchScore?.gender ? selectedMatchScore.gender.toFixed(4) : 0}
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <strong>Goals : </strong>
                    {selectedMatchScore?.goals ? selectedMatchScore.goals.toFixed(4) : 0}
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <strong>Interests : </strong>
                    {selectedMatchScore?.interests ? selectedMatchScore.interests.toFixed(4) : 0}
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <strong>Level : </strong>
                    {selectedMatchScore?.level.toFixed(4)}
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <strong>Status : </strong>
                    {selectedMatchScore?.status.toFixed(4)}
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <strong>Meeting Frequency : </strong>
                    {selectedMatchScore?.meetingFrequency.toFixed(4)}
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <strong>Certificate Option : </strong>
                    {selectedMatchScore?.certificateOption.toFixed(4)}
                </Typography>
                <Typography sx={{ p: 1 }}>
                    <strong>Total : </strong>
                    {selectedMatchScore?.total}
                </Typography>
            </Popover>
        </Table>
    );
};

export default TandemTable;
