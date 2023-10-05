import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { useTranslate } from 'react-admin';
import { DisplayGender, DisplayLearningType, DisplayRole } from '../../../components/translated';
import Language from '../../../entities/Language';
import { LearningType } from '../../../entities/LearningLanguage';
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
                            {partner.compatibilityScore ? `${partner.compatibilityScore * 100}%` : 'N/A'}
                        </TableCell>
                        <TableCell>{new Date(partner.createdAt).toLocaleDateString()}</TableCell>
                        {actions && <TableCell>{actions(partner)}</TableCell>}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TandemTable;
