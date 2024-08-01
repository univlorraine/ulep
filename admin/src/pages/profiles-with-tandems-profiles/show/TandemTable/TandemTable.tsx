import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Box } from '@mui/material';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useRecordContext, useTranslate } from 'react-admin';
import ColoredChips from '../../../../components/ColoredChips';
import { DisplayLearningType } from '../../../../components/translated';
import Language from '../../../../entities/Language';
import { LearningType } from '../../../../entities/LearningLanguage';
import { MatchScore } from '../../../../entities/Match';
import { Profile } from '../../../../entities/Profile';
import { ProfileWithTandemsProfiles } from '../../../../entities/ProfileWithTandemsProfiles';
import codeLanguageToFlag from '../../../../utils/codeLanguageToFlag';
import hasTandemManagementPermission from '../../hasTandemManagementPermission';
import ProfileLink from '../../ui/ProfileTandemLink';
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

interface TandemTableProps {
    rows: TandemPartner[];
    actions?: (partner: TandemPartner) => React.ReactNode;
    displayTandemLanguage?: boolean;
    pagination?: Omit<Pagination<TandemPartner>, 'resetPage' | 'visibleRows'>;
}

const TandemTable = ({ rows, actions, displayTandemLanguage, pagination }: TandemTableProps) => {
    const translate = useTranslate();
    const record: ProfileWithTandemsProfiles = useRecordContext();

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
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.level')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.role')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.learningType')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.gender')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.age')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.score')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.date')}</TableCell>
                    {actions && hasTandemManagementPermission() && (
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
                                color={partner.profile.user.role === record.user.role ? 'success' : 'error'}
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
                        {actions && hasTandemManagementPermission() && <TableCell>{actions(partner)}</TableCell>}
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
                PaperProps={{
                    style: {
                        borderRadius: 10,
                    },
                }}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                id="mouse-over-popover"
                onClose={handlePopoverClose}
                open={open}
                sx={{
                    pointerEvents: 'none',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>{`Age : ${selectedMatchScore?.age}`}</Typography>
                <Typography sx={{ p: 1 }}>{`Gender : ${selectedMatchScore?.gender}`}</Typography>
                <Typography sx={{ p: 1 }}>{`Goals : ${selectedMatchScore?.goals}`}</Typography>
                <Typography sx={{ p: 1 }}>{`Interests : ${selectedMatchScore?.interests}`}</Typography>
                <Typography sx={{ p: 1 }}>{`Level : ${selectedMatchScore?.level}`}</Typography>
                <Typography sx={{ p: 1 }}>{`Status : ${selectedMatchScore?.status}`}</Typography>
                <Typography sx={{ p: 1 }}>{`Total : ${selectedMatchScore?.total}`}</Typography>
            </Popover>
        </Table>
    );
};

export default TandemTable;
