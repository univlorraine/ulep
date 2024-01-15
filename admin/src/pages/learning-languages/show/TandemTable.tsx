import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import { DisplayGender, DisplayLearningType, DisplayRole } from '../../../components/translated';
import Language from '../../../entities/Language';
import { LearningType } from '../../../entities/LearningLanguage';
import { MatchScore } from '../../../entities/Match';
import { Profile } from '../../../entities/Profile';
import ProfileLink from '../ui/ProfileLink';

interface TandemPartner {
    id: string;
    profile: Profile;
    name: string;
    learningType: LearningType;
    effectiveLearningType?: LearningType;
    level: string;
    createdAt: Date;
    matchScore?: MatchScore;
    compatibilityScore?: number;
    tandemLanguage?: Language;
}

interface TandemTableProps {
    partners: TandemPartner[];
    actions?: (partner: TandemPartner) => React.ReactNode;
    displayTandemLanguage?: boolean;
}

const TandemTable = ({ partners, actions, displayTandemLanguage }: TandemTableProps) => {
    const translate = useTranslate();

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
        <Table>
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
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.university')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.role')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.learningType')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.gender')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.age')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.score')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.date')}</TableCell>
                    {actions && (
                        <TableCell>{translate('learning_languages.show.tandems.tableColumns.actions')}</TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {partners.map((partner) => (
                    <TableRow key={partner.id}>
                        {displayTandemLanguage && (
                            <TableCell>
                                {[partner.profile.nativeLanguage, ...partner.profile.masteredLanguages]
                                    .map((language) => language.name)
                                    .join(', ')}
                            </TableCell>
                        )}
                        <TableCell>
                            <ProfileLink profile={partner.profile} />
                        </TableCell>
                        <TableCell>{partner.name}</TableCell>
                        <TableCell>{partner.level}</TableCell>
                        <TableCell>{partner.profile.user.university.name}</TableCell>
                        <TableCell>
                            <DisplayRole role={partner.profile.user.role} />
                        </TableCell>
                        <TableCell>
                            <DisplayLearningType
                                effectiveLearningType={partner.effectiveLearningType}
                                learningType={partner.learningType}
                            />
                        </TableCell>
                        <TableCell>
                            <DisplayGender gender={partner.profile.user.gender} />
                        </TableCell>
                        <TableCell>{partner.profile.user.age}</TableCell>
                        <TableCell>
                            <div>
                                <Typography
                                    aria-haspopup="true"
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    onMouseEnter={(event) => handlePopoverOpen(event, partner.matchScore)}
                                    onMouseLeave={handlePopoverClose}
                                >
                                    {partner.compatibilityScore ? `${partner.compatibilityScore * 100}%` : 'N/A'}
                                </Typography>
                            </div>
                        </TableCell>
                        <TableCell>{new Date(partner.createdAt).toLocaleDateString()}</TableCell>
                        {actions && <TableCell>{actions(partner)}</TableCell>}
                    </TableRow>
                ))}
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
