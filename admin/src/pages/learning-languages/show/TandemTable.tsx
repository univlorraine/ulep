import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { useTranslate } from 'react-admin';
import { DisplayLearningType, DisplayRole } from '../../../components/translated';
import { LearningLanguage } from '../../../entities/LearningLanguage';
import ProfileLink from '../ui/ProfileLink';

interface LearningLanguageWithScore extends LearningLanguage {
    score?: number;
}

interface TandemTableProps {
    partners: LearningLanguageWithScore[];
    actions?: (partner: LearningLanguageWithScore) => React.ReactNode;
}

const TandemTable = ({ partners, actions }: TandemTableProps) => {
    const translate = useTranslate();

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.profile')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.learnedLanguage')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.level')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.university')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.role')}</TableCell>
                    <TableCell>{translate('learning_languages.show.tandems.tableColumns.learningType')}</TableCell>
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
                            <DisplayLearningType learningType={partner.profile.learningType} />
                        </TableCell>
                        <TableCell>{partner.score ?? 'N/A'}</TableCell>
                        <TableCell>{new Date(partner.createdAt).toLocaleDateString()}</TableCell>
                        {actions && <TableCell>{actions(partner)}</TableCell>}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TandemTable;
